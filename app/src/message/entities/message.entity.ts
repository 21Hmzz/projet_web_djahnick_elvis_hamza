import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Message {
  @Field(() => Int, { description: 'Id of the message' })
  id: number;

  @Field({ description: 'Content of the message' })
  content: string;

  @Field({ description: 'Date of the message' })
  date: string;

  @Field(() => Int, { description: 'Id of the conversation' })
  conversationId: number;

  @Field(() => Int, { description: 'Id of the user' })
  userId: number;
}
