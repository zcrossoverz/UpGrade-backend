import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthService } from 'src/auth/auth.service';
import { UnitController } from './unit.controller';
import { UnitService } from './unit.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'UNIT_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RBMQ_URI],
          queue: 'course_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
      {
        name: 'AUTH_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RBMQ_URI],
          queue: 'auth_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  controllers: [UnitController],
  providers: [UnitService, AuthService],
})
export class UnitModule {}
