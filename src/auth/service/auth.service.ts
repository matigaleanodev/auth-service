import {
  Injectable,
  UnauthorizedException,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '@users/models/user.entity';
import { LoginUserDTO } from '@users/dto/login-user.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Inicia sesión validando el usuario y la contraseña.
   * @param loginUserDto Datos del usuario.
   * @returns Tokens de acceso y refresh.
   */
  async login({ email, password }: LoginUserDTO) {
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'refreshToken'], // Asegura que traiga estos campos
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    const passwordsMatch = await bcrypt.compare(password, user.password);
    if (!passwordsMatch) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refresh_token);
    return tokens;
  }

  /**
   * Busca un usuario por su email.
   * @param email Email del usuario.
   * @returns Usuario encontrado o null.
   */
  private async findUserByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'name', 'password', 'refreshToken'],
    });
  }

  /**
   * Valida si la contraseña ingresada es correcta.
   * @param password Contraseña ingresada.
   * @param storedPasswordHash Hash de la contraseña almacenada.
   * @returns Booleano indicando si coinciden.
   */
  private async validatePassword(
    password: string,
    storedPasswordHash: string,
  ): Promise<boolean> {
    if (typeof bcrypt.compare === 'function') {
      return await bcrypt.compare(password, storedPasswordHash);
    } else {
      throw new InternalServerErrorException(
        'Bcrypt compare function not available',
      );
    }
  }

  /**
   * Genera el access token y el refresh token.
   * @param userId ID del usuario.
   * @param email Email del usuario.
   * @returns Access token y refresh token.
   */
  private async getTokens(
    userId: number,
    email: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const secret = this.configService.get<string>('SECRET_KEY');
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, email },
        {
          secret,
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        { sub: userId },
        {
          secret,
          expiresIn: '7d',
        },
      ),
    ]);
    return {
      access_token: access_token,
      refresh_token: refresh_token,
    };
  }

  /**
   * Guarda el refresh token en la base de datos (cifrado).
   * @param userId ID del usuario.
   * @param refreshToken Token de refresco.
   */
  private async updateRefreshToken(userId: number, refreshToken: string) {
    try {
      const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
      await this.userRepository.update(userId, {
        refreshToken: hashedRefreshToken,
      });
    } catch {
      throw new Error('Error hashing the refresh token');
    }
  }

  /**
   * Refresca el access token si el refresh token es válido.
   * @param refreshToken Token de refresco.
   * @returns Nuevo access token y refresh token.
   */
  async refreshToken(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token requerido');
    }

    const user = await this.userRepository.findOne({
      where: { refreshToken },
    });

    if (!user) {
      throw new UnauthorizedException('Refresh token inválido');
    }

    return this.getTokens(user.id, user.email);
  }
}
