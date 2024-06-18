import { CreateMessageInput } from './create-message.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateMessageInput extends PartialType(CreateMessageInput) {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  conversationId: number;

  @Field()
  content: string;

  @Field(() => Int)
  userId: number;

  @Field()
  date: string;
}
