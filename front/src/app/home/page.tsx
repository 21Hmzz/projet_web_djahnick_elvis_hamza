"use client";

import { gql, useLazyQuery, useQuery } from "@apollo/client";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { get_me, get_users } from "@/graphql";
import { useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import { ChatBox } from "../chat/chatbox";
import { Conversation, User } from "@/__generated__/graphql";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PlusCircle } from "lucide-react";
import { NewConversation } from "./newconversation.dialog";

type UserPayload = {
  me: User;
};

export default function Home() {
  const token = getCookie("token_graphql");
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [data, setData] = useState<UserPayload | null>(null);

  const [getUsers, { data: me, loading, error, refetch }] =
    useLazyQuery<UserPayload>(get_me, {
      fetchPolicy: "network-only",
      onError: (error) => {
        console.error(error);
      },
      context: {
        headers: {
          authorization: `Bearer ${token}`,
        },
      },
      onCompleted: (data) => {
        setData(data);
      },
    });

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  useEffect(() => {
    if (data && conversation) {
      const updatedConversation = data.me.conversations.find(
        (c) => c.id === conversation.id
      );
      setConversation(updatedConversation || null);
    }
  }, [data, conversation]);

  const handleRefetch = async () => {
    try {
      const { data: newData } = await refetch({
        context: {
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
      });
      if (newData) {
        setData(newData);
      }
    } catch (refetchError) {
      console.error("Refetch error:", refetchError);
      toast.error("Failed to refresh data");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    toast.error("An error occurred");
    return <div>Error: {error.message}</div>;
  }

  // setInterval(() => {
  //   if (data) {
  //     getUsers();
  //   }
  // }, 3000);

  return (
    <div className="p-4  h-full">
      <div className="flex flex-col gap-2  w-full ">
        <div className="flex gap-2">
          <div className="flex gap-2 p-4 w-full overflow-x-auto  shadow-md rounded-lg">
            {data &&
              data.me.conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className="flex flex-col border p-4 cursor-pointer rounded-lg hover:scale-105 transition-transform gap-2"
                  onClick={() => setConversation(conversation)}
                >
                  <p className="text-sm text-gray-800">
                    {conversation.recipient.firstname}{" "}
                    {conversation.recipient.lastname}
                  </p>
                  <Separator />
                  <p className="text-sm text-gray-800">{conversation.name}</p>
                </div>
              ))}
          </div>
          <div className="flex justify-center p-4 absolute left-0 bottom-5">
            <span>
              {data && (
                <NewConversation userId={data?.me.id} refetch={handleRefetch} />
              )}
            </span>
          </div>
        </div>
        <div className=" min-h-[80vh]  max-h-[80vh] overflow-y-auto">
          {conversation && data && (
            <ChatBox
              refetch={handleRefetch}
              conversation={conversation}
              userId={data?.me.id}
            />
          )}
        </div>
      </div>
    </div>
  );
}
