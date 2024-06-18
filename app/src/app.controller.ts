import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Inject } from '@nestjs/common';
import { Redis } from 'ioredis';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('REDIS') private readonly redis: Redis,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
