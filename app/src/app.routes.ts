import { Routes } from '@nestjs/core';
import { HealthModule } from './health/health.module';

export const routes: Routes = [
  {
    path: 'health',
    module: HealthModule,
  },
];
