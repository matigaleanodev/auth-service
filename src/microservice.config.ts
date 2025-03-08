import { MicroserviceOptions, Transport } from '@nestjs/microservices';

export const microserviceConfig: MicroserviceOptions = {
  transport: Transport.TCP,
  options: {
    host: process.env.MICROSERVICE_HOST || 'localhost',
    port: parseInt(process.env.MICROSERVICE_PORT) || 4000,
  },
};
