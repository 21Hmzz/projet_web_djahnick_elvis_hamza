import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';
import { BullQueueModule } from '../bull/bull.module';
import { HealthResolver } from './health.resolver';

@Module({
  imports: [BullQueueModule],
  controllers: [HealthController],
  providers: [HealthService, HealthResolver],
  exports: [HealthService, HealthResolver],
})
export class HealthModule {}
