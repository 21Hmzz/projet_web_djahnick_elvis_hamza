import { forwardRef, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './health/health.module';
import { AppRoutingModule } from './app.routing-module';
import { BullQueueModule } from './bull/bull.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { UsersModule } from './users/users.module';
import { ConversationModule } from './conversation/conversation.module';
import { RedisModule } from './redis/redis.module';
import { AuthModule } from './auth/auth.module';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ChatModule } from './chat.module';
import { MessageModule } from './message/message.module';

@Module({
  imports: [
    forwardRef(() => ChatModule),
    forwardRef(() => RedisModule),
    forwardRef(() => HealthModule),
    // forwardRef(() => BullQueueModule),
    BullQueueModule,
    AppRoutingModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      context: ({ req }) => ({ user: req.user }),
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      subscriptions: {
        'graphql-ws': true,
      },
    }),
    forwardRef(() => UsersModule),
    forwardRef(() => MessageModule),
    forwardRef(() => ConversationModule),
    forwardRef(() => AuthModule),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
