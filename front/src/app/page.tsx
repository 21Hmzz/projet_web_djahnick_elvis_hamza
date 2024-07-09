"use client";
import { Message } from "@/__generated__/graphql";
import { gql, useQuery } from "@apollo/client";
import Image from "next/image";

const message_query = gql(`query messages{
  messages{id content userId conversationId}
}`);

export default function Home() {
  const { data, loading, error } = useQuery(message_query);

  if (loading) return <div>Loading...</div>;

  if (error) return <div>Error: {error.message}</div>;
  return (
    <div>
      <h1>Messages</h1>
      <ul>
        {data.messages.map((message: Message) => (
          <li key={message.id}>
            <p>{message.content}</p>
            <p>{message.userId}</p>
            <p>{message.conversationId}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
