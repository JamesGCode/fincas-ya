"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Loader2,
  Phone,
  User,
  MoreVertical,
  Wand2Icon,
  BotIcon,
  UserIcon,
} from "lucide-react";
import { useRef, useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AIConversation,
  AIConversationContent,
  AIConversationScrollButton,
} from "@/components/ui/ai/conversation";
import { AIMessage, AIMessageContent } from "@/components/ui/ai/message";
import { AIResponse } from "@/components/ui/ai/response";
import {
  AIInput,
  AIInputButton,
  AIInputSubmit,
  AIInputTextarea,
  AIInputToolbar,
  AIInputTools,
} from "@/components/ui/ai/input";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";

import { inboxService } from "@/services/inbox.service";
import { useInboxStore } from "@/store/useInboxStore";
import { Conversation } from "@/types/inbox";
import { cn } from "@/lib/utils";
import { DicebearAvatar } from "./dicebear-avatar";

export function ConversationView() {
  const { selectedConversationId } = useInboxStore();
  const queryClient = useQueryClient();
  const [inputText, setInputText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Obtener mensajes de la conversación actual
  const { data: messagesData, isLoading } = useQuery<any[]>({
    queryKey: ["messages", selectedConversationId],
    queryFn: () => inboxService.getMessages(selectedConversationId!),
    enabled: !!selectedConversationId,
    refetchInterval: 5000,
  });

  // Reutilizamos el caché de la lista de conversaciones
  const { data: convData } = useQuery<Conversation[]>({
    queryKey: ["conversations", "all", "all"],
    queryFn: () => inboxService.getConversations({}), // FIX: Passed fallback queryFn
    staleTime: Infinity,
  });

  const conversation = convData?.find(
    (c: Conversation) => c._id === selectedConversationId,
  );
  const messages = messagesData || [];

  // Mutations
  const sendMutation = useMutation({
    mutationFn: (text: string) =>
      inboxService.sendMessage(selectedConversationId!, {
        text,
        type: "text",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["messages", selectedConversationId],
      });
      setInputText("");
    },
  });

  const statusMutation = useMutation({
    mutationFn: (status: "human" | "ai" | "resolved" | "unresolved") =>
      inboxService.updateStatus(selectedConversationId!, status as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });

  const priorityMutation = useMutation({
    mutationFn: (priority: "urgent" | "high" | "medium" | "low") =>
      inboxService.updatePriority(selectedConversationId!, priority),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim() || sendMutation.isPending) return;
    sendMutation.mutate(inputText);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!selectedConversationId) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex h-full flex-col bg-muted">
        <header className="flex items-center justify-between border-b bg-background p-2.5">
          <div className="flex items-center justify-center p-2">
            <Button
              disabled
              size="sm"
              variant="outline"
              className="bg-neutral-100 text-neutral-500 h-8"
            >
              Cargando chat...
            </Button>
          </div>
        </header>

        <AIConversation className="max-h-[calc(100vh-180px)]">
          <AIConversationContent>
            {Array.from({ length: 8 }, (_, index) => {
              const isUser = index % 2 === 0;
              const widths = ["w-48", "w-60", "w-72"];
              const width = widths[index % widths.length];

              return (
                <div
                  key={index}
                  className={cn(
                    "group flex w-full items-end justify-end gap-2 py-2 [&>div]:max-w-[80%]",
                    isUser ? "is-user" : "is-assistant flex-row-reverse",
                  )}
                >
                  <Skeleton
                    className={`h-9 ${width} rounded-lg bg-neutral-200/50`}
                  />
                  <Skeleton className="size-8 rounded-full bg-neutral-200/50" />
                </div>
              );
            })}
          </AIConversationContent>
        </AIConversation>

        <div className="p-2">
          <AIInput>
            <AIInputTextarea
              disabled
              placeholder="Escribe tu mensaje como un operador..."
            />
            <AIInputToolbar>
              <AIInputTools />
              <AIInputSubmit disabled status="ready" />
            </AIInputToolbar>
          </AIInput>
        </div>
      </div>
    );
  }

  const isResolved = conversation?.status === "resolved";
  const isHumanEscalated = conversation?.status === "human";

  return (
    <div className="flex flex-col h-full bg-muted">
      {/* Header */}
      <div className="flex items-center justify-between border-b bg-background p-2.5">
        <div className="flex items-center gap-3">
          <DicebearAvatar
            seed={conversation?.contact?.name ?? "user"}
            size={36}
          />

          <div className="flex flex-col">
            <span className="text-[15px] font-semibold text-foreground leading-tight">
              {conversation?.contact?.name || "Cliente"}
            </span>
            <span className="text-[12px] text-muted-foreground truncate">
              {conversation?.contact?.phone}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center space-x-2">
            <BotIcon
              className={cn(
                "size-4",
                isHumanEscalated ? "text-muted-foreground" : "text-primary",
              )}
            />
            <Switch
              checked={isHumanEscalated}
              onCheckedChange={(checked) =>
                statusMutation.mutate(checked ? "human" : "ai")
              }
              id="ai-mode"
            />
            <Label htmlFor="ai-mode" className="text-xs font-semibold">
              Operador Manual
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={isResolved}
              onCheckedChange={(checked) =>
                statusMutation.mutate(checked ? "resolved" : "human")
              } // or "ai" depending on rules
              id="resolved-mode"
              className="data-[state=checked]:bg-emerald-500"
            />
            <Label
              htmlFor="resolved-mode"
              className="text-xs font-semibold hidden sm:block"
            >
              Resuelto
            </Label>
          </div>

          <Select
            value={conversation?.priority}
            onValueChange={(val: any) => priorityMutation.mutate(val)}
          >
            <SelectTrigger className="w-[105px] h-8 text-xs bg-muted/50 focus:ring-0">
              <SelectValue placeholder="Prioridad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="urgent">Urgente</SelectItem>
              <SelectItem value="high">Alta</SelectItem>
              <SelectItem value="medium">Media</SelectItem>
              <SelectItem value="low">Baja</SelectItem>
            </SelectContent>
          </Select>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:bg-muted"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Ver cliente
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Phone className="mr-2 h-4 w-4" />
                Llamar (+57)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Messages Area Using UI AI components */}
      <AIConversation className="max-h-[calc(100vh-139.95px)]">
        <AIConversationContent>
          {messages.map((msg: any) => {
            // El backend retorna "sender": "user" o "assistant" (o system)
            // Adaptado según el JSON proporcionado por el usuario
            const isContact =
              typeof msg.sender === "string"
                ? msg.sender === "user"
                : msg.sender?.role === "user"; // El cliente CRM es el user

            // Si es el cliente CRM (isContact = true), lo mostramos a la izquierda (from = "assistant" engañando la prop para que lo alinee)
            // Si es el admin/bot (isContact = false), lo mostramos a la derecha (from = "user")
            const fromPos = isContact ? "assistant" : "user";

            const timeDate = msg._creationTime || msg.createdAt;
            const formattedTime = timeDate
              ? format(new Date(timeDate), "h:mm a", {
                  locale: es,
                }).toLowerCase()
              : "";

            const isSystem =
              msg.sender === "system" || msg.sender?.role === "system";

            return (
              <AIMessage
                key={msg._id}
                from={fromPos}
                className={cn(isSystem && "opacity-70 scale-95")}
              >
                <AIMessageContent
                  className={cn(
                    isContact
                      ? "bg-background text-foreground"
                      : "bg-[#dcedff] dark:bg-[#dcedff]/10 text-foreground",
                  )}
                >
                  {/* System Tag */}
                  {isSystem && (
                    <div className="text-[10px] text-muted-foreground/80 mb-1 font-semibold">
                      Sistema
                    </div>
                  )}

                  {/* Render Images if exist */}
                  {msg.type === "image" && msg.mediaUrl && (
                    <div className="mb-2 max-w-sm rounded-md overflow-hidden border border-black/5 bg-black/5">
                      <img
                        src={msg.mediaUrl}
                        alt="Image attachment"
                        className="object-contain max-h-64 w-full"
                      />
                    </div>
                  )}

                  {/* Text Content */}
                  {msg.content && (
                    <AIResponse className="whitespace-pre-wrap">
                      {msg.content}
                    </AIResponse>
                  )}

                  {msg.text && (
                    <AIResponse className="whitespace-pre-wrap">
                      {msg.text}
                    </AIResponse>
                  )}

                  {formattedTime && (
                    <div
                      className={cn(
                        "flex mt-0.5",
                        isContact ? "justify-start" : "justify-end",
                      )}
                    >
                      <span
                        className={cn(
                          "text-[10px] font-medium leading-none",
                          isContact
                            ? "text-muted-foreground"
                            : "text-blue-900/50 dark:text-blue-200/50",
                        )}
                      >
                        {formattedTime}
                      </span>
                    </div>
                  )}
                </AIMessageContent>

                {isContact && (
                  <DicebearAvatar
                    seed={conversation?.contact?.name ?? "user"}
                    size={32}
                  />
                )}
              </AIMessage>
            );
          })}
        </AIConversationContent>
        <AIConversationScrollButton />
      </AIConversation>

      {/* Input Base */}
      <div className="p-3 bg-background border-t">
        <div className="flex items-end gap-2 p-1 border rounded-lg bg-background overflow-hidden relative focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
          <AIInputTextarea
            ref={textareaRef}
            autoFocus
            className="flex-1 min-h-[44px] resize-none pb-2 pt-3 pl-3 shadow-none focus-visible:ring-0 border-none rounded-none bg-transparent"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={
              conversation?.status === "resolved" || sendMutation.isPending
            }
            placeholder={
              conversation?.status === "resolved"
                ? "Esta conversación ha sido resuelta"
                : "Escribe tu mensaje como operador..."
            }
          />
          <div className="flex items-center gap-1 shrink-0 pb-1.5 pr-2">
            <AIInputButton
              onClick={() => {}}
              disabled={
                conversation?.status === "resolved" || !inputText.trim()
              }
              className="h-9 px-3"
            >
              <Wand2Icon className="h-4 w-4 mr-1.5" />
              Mejorar
            </AIInputButton>
            <AIInputSubmit
              disabled={
                conversation?.status === "resolved" ||
                !inputText.trim() ||
                sendMutation.isPending
              }
              onClick={handleSend}
              className="h-9 w-9 shrink-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
