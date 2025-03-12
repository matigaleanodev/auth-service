import { Controller, UnauthorizedException } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { AuthService } from '@auth/service/auth.service';
import { LoginUserDTO } from '@users/dto/login-user.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
}
