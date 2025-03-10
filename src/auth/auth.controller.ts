import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { LoginUserDTO } from '@users/dto/login-user.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Maneja la autenticación de usuarios.
   * @param loginUserDto Datos del usuario (email y password).
   * @returns Tokens de acceso y refresh.
   */
  @MessagePattern('auth.login')
  async login(@Payload() loginUserDto: LoginUserDTO) {
    return this.authService.login(loginUserDto);
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
}
