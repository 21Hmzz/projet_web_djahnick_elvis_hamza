import { gql } from "@apollo/client";

export const get_me = gql`
  query Query {
    me {
      conversations {
        id
        name
        recipientId
        userId
        user {
          id
          email
          firstname
          lastname
        }
        recipient {
          id
          email
          firstname
          lastname
        }
        messages {
          content
          conversationId
          date
          read
          id
          userId
        }
      }
      email
      firstname
      id
      lastname
      password
    }
  }
`;
export const get_users = gql`
  query Conversations {
    users {
      conversations {
        id
        name
        recipientId
        userId
      }
      email
      firstname
      id
      lastname
    }
  }
`;

export const get_user = gql`
  query User($userId: Int!) {
    user(id: $userId) {
      conversations {
        id
        name
        recipientId
        userId
      }
      email
      firstname
      id
      lastname
    }
  }
`;

export const get_users_conversations = gql`
  query UserConversations($userConversationsId: Int!) {
    userConversations(id: $userConversationsId) {
      id
      name
      recipientId
      userId
    }
  }
`;

export const get_conversation = gql`
  query Conversation($conversationId: Int!) {
    conversation(id: $conversationId) {
      id
      name
      recipientId
      userId
    }
  }
`;

export const get_conversations = gql`
  query Conversations {
    conversations {
      id
      name
      recipientId
      userId
    }
  }
`;

export const get_conversation_messages = gql`
  query ConversationMessages($conversationMessagesId: Int!) {
    conversationMessages(id: $conversationMessagesId) {
      content
      conversationId
      date
      id
      userId
    }
  }
`;

export const get_message = gql`
  query Conversations($messageId: Int!) {
    message(id: $messageId) {
      content
      conversationId
      date
      id
      userId
    }
  }
`;

export const get_messages = gql`
  query Messages {
    messages {
      content
      conversationId
      date
      id
      userId
    }
  }
`;

export const createMessage = gql`
  mutation CreateMessage($createMessageInput: CreateMessageInput!) {
    createMessage(createMessageInput: $createMessageInput) {
      content
      id
      userId
      date
      conversationId
    }
  }
`;

export const createConversation = gql`
  mutation Mutation($createConversationInput: CreateConversationInput!) {
    createConversation(createConversationInput: $createConversationInput) {
      id
    }
  }
`;

export const updateMessage = gql`
  mutation setMessageRead($setMessageReadId: Int!) {
    setMessageRead(id: $setMessageReadId) {
      id
    }
  }
`;
