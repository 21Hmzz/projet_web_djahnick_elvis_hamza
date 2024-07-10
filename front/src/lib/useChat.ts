import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import { get_conversation_messages } from "@/graphql";
import { useQuery } from "@apollo/client";

const SOCKET_SERVER_URL = "http://localhost:3000"; // Remplacez par l'URL de votre serveur NestJS

type Message = {
  id: number;
  content: string;
  date: string;
  conversationId: number;
  userId: number;
  read: boolean;
};

const useChat = (conversationId: number) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const socketRef = useRef<any>();

  const { data, loading, error } = useQuery(get_conversation_messages, {
    variables: { conversationMessagesId: conversationId },
  });

  useEffect(() => {
    if (data && data.conversationMessages) {
      setMessages(data.conversationMessages);
    }
  }, [data]);

  useEffect(() => {
    if (!socketRef.current) {
      console.log("Connecting to WebSocket...");
      socketRef.current = io(SOCKET_SERVER_URL);

      socketRef.current.on("connect", () => {
        console.log("Connected to WebSocket with ID:", socketRef.current.id);
      });

      socketRef.current.on("disconnect", () => {
        console.log("Disconnected from WebSocket");
      });

      socketRef.current.on("newMessage", (message: Message) => {
        console.log("Received message:", message);
        if (message.conversationId === conversationId) {
          setMessages((prevMessages) => [...prevMessages, message]);
        }
      });
    }

    return () => {
      if (socketRef.current) {
        console.log("Disconnecting from WebSocket...");
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [conversationId]);

  const sendMessage = (content: string, userId: number) => {
    const message = {
      id: Date.now(),
      content,
      userId,
      conversationId,
      date: new Date().toISOString(),
      read: false,
    };
    console.log("Sending message:", message);
    socketRef.current.emit("message", message);
  };

  return {
    messages,
    sendMessage,
    loading,
    error,
  };
};

export default useChat;
