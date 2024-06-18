import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { routes } from './app.routes';
import { HealthModule } from './health/health.module';

@Module({
  exports: [RouterModule],
  imports: [RouterModule.register(routes), HealthModule],
})
export class AppRoutingModule {}
