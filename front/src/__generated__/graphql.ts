/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type AuthPayload = {
  __typename?: 'AuthPayload';
  token: Scalars['String']['output'];
};

export type Conversation = {
  __typename?: 'Conversation';
  /** Id of the conversation */
  id: Scalars['Int']['output'];
  messages: Array<Message>;
  /** Name of the conversation */
  name?: Maybe<Scalars['String']['output']>;
  recipient: User;
  /** Id of the recipient */
  recipientId: Scalars['Int']['output'];
  user: User;
  /** Id of the user */
  userId: Scalars['Int']['output'];
};

export type CreateConversationInput = {
  /** Name of the conversation */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Id of the recipient */
  recipientId: Scalars['Int']['input'];
  /** Id of the user */
  userId: Scalars['Int']['input'];
};

export type CreateMessageInput = {
  /** Content of the message */
  content: Scalars['String']['input'];
  /** Id of the conversation */
  conversationId: Scalars['Int']['input'];
  /** Date of the message */
  date: Scalars['String']['input'];
  /** Id of the user */
  userId: Scalars['Int']['input'];
};

export type CreateUserInput = {
  /** Email of the user */
  email: Scalars['String']['input'];
  /** FirstName of the user */
  firstname: Scalars['String']['input'];
  /** LastName of the user */
  lastname: Scalars['String']['input'];
  /** Password of the user */
  password: Scalars['String']['input'];
};

export type Message = {
  __typename?: 'Message';
  /** Content of the message */
  content: Scalars['String']['output'];
  /** Id of the conversation */
  conversationId: Scalars['Int']['output'];
  /** Date of the message */
  date: Scalars['String']['output'];
  /** Id of the message */
  id: Scalars['Int']['output'];
  /** Is the message read */
  read: Scalars['Boolean']['output'];
  /** Id of the user */
  userId: Scalars['Int']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createConversation: Conversation;
  createMessage: Message;
  createUser: User;
  login: AuthPayload;
  removeConversation: Conversation;
  removeMessage: Message;
  removeUser: User;
  signIn: AuthPayload;
  updateConversation: Conversation;
  updateMessage: Message;
  updateUser: User;
};


export type MutationCreateConversationArgs = {
  createConversationInput: CreateConversationInput;
};


export type MutationCreateMessageArgs = {
  createMessageInput: CreateMessageInput;
};


export type MutationCreateUserArgs = {
  createUserInput: CreateUserInput;
};


export type MutationLoginArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationRemoveConversationArgs = {
  id: Scalars['Int']['input'];
};


export type MutationRemoveMessageArgs = {
  id: Scalars['Int']['input'];
};


export type MutationRemoveUserArgs = {
  id: Scalars['Int']['input'];
};


export type MutationSignInArgs = {
  email: Scalars['String']['input'];
  firstname: Scalars['String']['input'];
  lastname: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationUpdateConversationArgs = {
  updateConversationInput: UpdateConversationInput;
};


export type MutationUpdateMessageArgs = {
  updateMessageInput: UpdateMessageInput;
};


export type MutationUpdateUserArgs = {
  updateUserInput: UpdateUserInput;
};

export type Query = {
  __typename?: 'Query';
  conversation: Conversation;
  conversationMessages: Array<Message>;
  conversations: Array<Conversation>;
  getHealth: Scalars['String']['output'];
  me: User;
  message: Message;
  messages: Array<Message>;
  user: User;
  userConversations: Array<Conversation>;
  users: Array<User>;
};


export type QueryConversationArgs = {
  id: Scalars['Int']['input'];
};


export type QueryConversationMessagesArgs = {
  id: Scalars['Int']['input'];
};


export type QueryMessageArgs = {
  id: Scalars['Int']['input'];
};


export type QueryUserArgs = {
  id: Scalars['Int']['input'];
};


export type QueryUserConversationsArgs = {
  id: Scalars['Int']['input'];
};

export type UpdateConversationInput = {
  id: Scalars['Int']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  recipientId: Scalars['Int']['input'];
  userId: Scalars['Int']['input'];
};

export type UpdateMessageInput = {
  content: Scalars['String']['input'];
  conversationId: Scalars['Int']['input'];
  date: Scalars['String']['input'];
  id: Scalars['Int']['input'];
  userId: Scalars['Int']['input'];
};

export type UpdateUserInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  firstname?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  lastname?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  conversations: Array<Conversation>;
  /** Email of the user */
  email: Scalars['String']['output'];
  /** FirstName of the user */
  firstname: Scalars['String']['output'];
  /** Id of the user */
  id: Scalars['Int']['output'];
  /** LastName of the user */
  lastname: Scalars['String']['output'];
  /** Password of the user */
  password: Scalars['String']['output'];
};

export type MessagesQueryVariables = Exact<{ [key: string]: never; }>;


export type MessagesQuery = { __typename?: 'Query', messages: Array<{ __typename?: 'Message', id: number, content: string, userId: number, conversationId: number }> };


export const MessagesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"messages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"messages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"conversationId"}}]}}]}}]} as unknown as DocumentNode<MessagesQuery, MessagesQueryVariables>;