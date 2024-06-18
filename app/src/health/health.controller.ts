import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';
import { BullService } from 'src/bull/bull.service';

@Controller()
export class HealthController {
  constructor(
    private readonly healthService: HealthService,
    private readonly bullService: BullService,
  ) {}

  @Get()
  async getHealth(): Promise<string> {
    await this.bullService.addJob({ data: 'Health Check OK 👌🏼' });
    return this.healthService.getHealth();
  }

  @Get('health-redis')
  async getHealthRedis(): Promise<string> {
    return this.healthService.getRedisHealth();
  }
}
