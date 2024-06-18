import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class HealthService {
  constructor(@Inject('REDIS') private readonly redis: Redis) {}
  getHealth(): string {
    return 'Ok 👌🏼';
  }

  async getRedisHealth(): Promise<any> {
    const status = await this.redis.status;
    const isHealthy = status === 'ready';
    return { status, isHealthy };
  }
}
