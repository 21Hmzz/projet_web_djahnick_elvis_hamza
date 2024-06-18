import { CreateConversationInput } from './create-conversation.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateConversationInput extends PartialType(
  CreateConversationInput,
) {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  userId: number;

  @Field({ nullable: true })
  name: string;

  @Field(() => Int)
  recipientId: number;
}
