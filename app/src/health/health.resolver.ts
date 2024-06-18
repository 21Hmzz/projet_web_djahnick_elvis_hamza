import { Resolver, Query } from '@nestjs/graphql';

@Resolver()
export class HealthResolver {
  @Query(() => String)
  getHealth(): string {
    return 'Resolver Ok 👌🏼';
  }
}
