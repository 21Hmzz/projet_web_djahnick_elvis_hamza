import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './health/health.module';
import { AppRoutingModule } from './app.routing-module';
import { BullQueueModule } from './bull/bull.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { UsersResolver } from './users/users.resolver';
import { UsersModule } from './users/users.module';
import { HealthResolver } from './health/health.resolver';
import { ConversationModule } from './conversation/conversation.module';
import { MessageModule } from './message/message.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    RedisModule,
    HealthModule,
    AppRoutingModule,
    BullQueueModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
    }),
    UsersModule,
    ConversationModule,
    MessageModule,
  ],
  controllers: [AppController],
  providers: [AppService, UsersResolver, HealthResolver],
})
export class AppModule {}
