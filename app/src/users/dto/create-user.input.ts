import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
  @Field({ description: 'FirstName of the user' })
  firstname: string;

  @Field({ description: 'LastName of the user' })
  lastname: string;

  @Field({ description: 'Email of the user' })
  email: string;

  @Field({ description: 'Password of the user' })
  password: string;
}
