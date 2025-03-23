import { Controller, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { LoginUserDTO } from '@users/dto/login-user.dto';
import { AuthService } from 'src/service/auth.service';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Maneja la autenticación de usuarios.
   * @param loginUserDto Datos del usuario (email y password).
   * @returns Tokens de acceso y refresh si las credenciales son correctas.
   * @throws UnauthorizedException si el login falla.
   */
  @MessagePattern('auth.login')
  async login(@Payload() loginUserDto: LoginUserDTO) {
    try {
      return await this.authService.login(loginUserDto);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw new RpcException({
          statusCode: 401,
          message: 'Credenciales incorrectas',
        });
      }
      throw new RpcException({
        statusCode: 500,
        message: 'Error interno del servidor',
      });
    }
  }

  /**
   * Refresca el access token si el refresh token es válido.
   * @param refreshToken Token de refresco.
   * @returns Nuevo access token y refresh token.
   */
  @MessagePattern('auth.refresh')
  async refreshToken(@Payload() refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }

  @MessagePattern('auth.request-password-reset')
  async requestPasswordReset(@Payload() { email }: { email: string }) {
    return this.authService.requestPasswordReset(email);
  }

  @MessagePattern('auth.reset-password')
  async resetPassword(
    @Payload() { token, newPassword }: { token: string; newPassword: string },
  ) {
    return this.authService.resetPassword(token, newPassword);
  }

  @MessagePattern('auth.validate-token')
  validateToken(data: { token: string }) {
    try {
      const payload = this.jwtService.verify(data.token, {
        secret: this.configService.get('SECRET_KEY'),
        algorithms: ['HS256'],
      });

      return { isValid: true, user: payload };
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token expirado');
      }
      if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Token inválido');
      }
      throw new UnauthorizedException('Error al verificar el token');
    }
  }
}
