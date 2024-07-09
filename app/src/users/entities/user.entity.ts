import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field(() => Int, { description: 'Id of the user' })
  id: number;

  @Field({ description: 'FirstName of the user' })
  firstname: string;

  @Field({ description: 'LastName of the user' })
  lastname: string;

  @Field({ description: 'Email of the user' })
  email: string;

  @Field({ description: 'Password of the user' })
  password: string;
}

@ObjectType()
export class AuthPayload {
  @Field()
  token: string;
}
