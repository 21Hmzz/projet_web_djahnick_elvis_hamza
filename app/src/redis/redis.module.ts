import { Module, Global } from '@nestjs/common';
import Redis from 'ioredis';

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS',
      useFactory: () => {
        return new Redis('redis://red-cppadpqj1k6c73fvf120:6379');
        // return new Redis({
        //   host: 'redis',
        //   port: 6379,
        // });
      },
    },
  ],
  exports: ['REDIS'],
})
export class RedisModule {}
