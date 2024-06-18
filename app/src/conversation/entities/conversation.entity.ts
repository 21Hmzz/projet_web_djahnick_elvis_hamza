import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Conversation {
  @Field(() => Int, { description: 'Id of the conversation' })
  id: number;

  @Field(() => Int, { description: 'Id of the user' })
  userId: number;

  @Field(() => Int, { description: 'Id of the recipient' })
  recipientId: number;

  @Field({ description: 'Name of the conversation', nullable: true })
  name: string;
}
