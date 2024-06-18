import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateConversationInput {
  @Field(() => Int, { description: 'Id of the user' })
  userId: number;

  @Field({ description: 'Name of the conversation', nullable: true })
  name: string;

  @Field(() => Int, { description: 'Id of the recipient' })
  recipientId: number;
}
