import { Module, Global } from '@nestjs/common';
import Redis from 'ioredis';

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS',
      useFactory: () => {
        return new Redis({
          host: 'redis',
          port: 6379,
        });
      },
    },
  ],
  exports: ['REDIS'],
})
export class RedisModule {}
