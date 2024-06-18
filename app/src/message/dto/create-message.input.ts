import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateMessageInput {
  @Field(() => Int, { description: 'Id of the conversation' })
  conversationId: number;

  @Field({ description: 'Content of the message' })
  content: string;

  @Field(() => Int, { description: 'Id of the user' })
  userId: number;

  @Field({ description: 'Date of the message' })
  date: string;
}
