import { Module } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './controller/auth.controller';
import { getTypeOrmConfig } from './config/typeorm.config';
import { UserEntity } from '@users/models/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(getTypeOrmConfig()),
    TypeOrmModule.forFeature([UserEntity]),
  ],
  providers: [AuthService, JwtService],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
