import { User } from "@/__generated__/graphql";
import { Button } from "@/components/ui/button";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowDownWideNarrow, PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { createConversation, get_users } from "@/graphql";
import { useLazyQuery, useMutation } from "@apollo/client";
import { getCookie } from "cookies-next";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast";

export function NewConversation({
  userId,
  refetch,
}: {
  userId: number;
  refetch: () => void;
}) {
  const token = getCookie("token_graphql");
  const [users, setUsers] = useState<User[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [name, setName] = useState("");

  const [addConversation] = useMutation(createConversation);

  const [getUsers, { data, loading, error }] = useLazyQuery(get_users, {
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
      setUsers(data.users);
    },
  });

  useEffect(() => {
    getUsers();
  }, []);

  const handleCreateConversation = async () => {
    if (!selected) {
      return;
    }

    try {
      await addConversation({
        variables: {
          createConversationInput: {
            name: name,
            recipientId: parseInt(selected),
            userId: userId,
          },
        },
      });
      toast.success("Conversation créée avec succès");
      refetch();
    } catch (e) {
      toast.error("Erreur lors de la création de la conversation");
      console.error(e);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button onClick={() => {}}>
          <PlusCircle size={24} />
          Nouvelle conversation
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Créer une nouvelle conversation</DialogTitle>
          <DialogDescription>
            Créez une nouvelle conversation en ajoutant des utilisateurs
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Nom
            </Label>
            <Input
              id="name"
              className="col-span-3"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4 w-full">
            <Label htmlFor="name" className="text-right">
              Utilisateur
            </Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-[200px] justify-between"
                >
                  {value ? value : "Sélectionner un utilisateur"}
                  <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput
                    placeholder="Rechercher un utilisateur"
                    className="h-9"
                  />
                  <CommandEmpty></CommandEmpty>
                  <CommandGroup>
                    {users.map((user) => (
                      <CommandItem
                        key={user.id}
                        value={user.id.toString()}
                        onSelect={(currentValue) => {
                          setValue(
                            currentValue === value
                              ? ""
                              : users.find(
                                  (user) => user.id.toString() === currentValue
                                )?.firstname +
                                  " " +
                                  users.find(
                                    (user) =>
                                      user.id.toString() === currentValue
                                  )?.lastname
                          );
                          setSelected(currentValue);
                          setOpen(false);
                        }}
                      >
                        {user.firstname} {user.lastname}
                        <CheckIcon
                          className={cn(
                            "ml-auto h-4 w-4",
                            value === user.firstname + " " + user.lastname
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleCreateConversation} type="submit">
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
