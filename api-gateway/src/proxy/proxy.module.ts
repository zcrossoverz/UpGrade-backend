import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { ProxyController } from './proxy.controller';

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => ({
        store: await redisStore({
          socket: {
            host: 'redis-10339.c295.ap-southeast-1-1.ec2.cloud.redislabs.com',
            port: 10339,
          },
          username: 'default',
          password: 'K2IzO3SSqHTxj9oaN2M0EaygIy1L4A6d',
        }),
      }),
    }),
  ],
  controllers: [ProxyController],
  providers: [],
})
export class ProxyModule {}
