import * as React from "react";
import { Check, DeleteIcon, Menu, Plus, Send, Trash } from "lucide-react";
import { getCookie } from "cookies-next";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import locale_fr from "dayjs/locale/fr";
dayjs.locale(locale_fr);
dayjs.extend(relativeTime);
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "react-hot-toast";
import { createMessage, get_conversation_messages, get_users } from "@/graphql";
import { useLazyQuery, useMutation } from "@apollo/client";
import { Conversation, Message, User } from "@/__generated__/graphql";

export function ChatBox({
  conversation,
  refetch,
  userId,
}: {
  conversation: Conversation;
  refetch: () => void;
  userId: number;
}) {
  const [open, setOpen] = React.useState(false);
  const [addMessage, { loading, error }] = useMutation(createMessage);
  const [input, setInput] = React.useState("");
  const messagesEndRef = React.useRef(null);
  const inputLength = input.trim().length;

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation.messages]);

  const handleSendMessage = async (message: string) => {
    try {
      await addMessage({
        variables: {
          createMessageInput: {
            content: message,
            conversationId: conversation.id,
            userId: userId,
            date: new Date().toISOString(),
          },
        },
      });
      refetch();
    } catch (e) {
      console.error(e);
      toast.error("An error occurred while sending the message.");
    }
  };

  return (
    <Card className="max-h-[80vh] flex flex-col ">
      <CardHeader className="flex flex-row items-center">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src="/avatars/01.png" alt="Image" />
            <AvatarFallback>
              {conversation.recipient.firstname[0]}
              {conversation.recipient.lastname[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium leading-none">
              {conversation.recipient.firstname}{" "}
              {conversation.recipient.lastname}
            </p>
            <p className="text-sm text-muted-foreground">
              {conversation.recipient.email}
            </p>
          </div>
        </div>
        <Menu className="ml-auto" />
      </CardHeader>
      <CardContent className="h-full overflow-y-auto flex flex-col gap-4 p-4">
        <div className="space-y-4">
          <span className="text-xs text-muted-foreground text-center ">
            {conversation.userId === userId ? "Vous" : "L'utilisateur"} avez{" "}
            démarrer une conversation
          </span>
          {conversation.messages.map((message, index) => (
            <>
              <div
                key={index}
                className={cn(
                  "flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
                  message.userId === userId
                    ? "ml-auto bg-primary text-primary-foreground"
                    : "bg-muted"
                )}
              >
                {message.content}
              </div>
              <span
                className={cn(
                  "flex w-max max-w-[75%] flex-col gap-2 rounded-lg  text-xs",
                  message.userId === userId ? "ml-auto" : ""
                )}
              >
                {dayjs(message.date).fromNow()}
              </span>
            </>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      <CardFooter>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (inputLength === 0) return;
            handleSendMessage(input);
            setInput("");
          }}
          className="flex w-full items-center space-x-2"
        >
          <Input
            id="message"
            placeholder="Entrez votre message..."
            className="flex-1"
            autoComplete="off"
            value={input}
            onChange={(event) => setInput(event.target.value)}
          />
          <Button type="submit" size="icon" disabled={inputLength === 0}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
