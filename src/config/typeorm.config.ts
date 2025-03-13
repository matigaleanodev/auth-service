import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UserEntity } from '@users/models/user.entity';

export const getTypeOrmConfig = (): TypeOrmModuleOptions => ({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: 3306,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  url: process.env.DB_URL,
  entities: [UserEntity],
  migrations: [__dirname + '/migration/*.ts'],
  synchronize: true,
});
