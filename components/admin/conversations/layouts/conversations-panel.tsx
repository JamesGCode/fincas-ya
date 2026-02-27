"use client";

import { useQuery } from "@tanstack/react-query";
import { format, isToday, isYesterday } from "date-fns";
import { es } from "date-fns/locale";
import {
  Search,
  Loader2,
  CornerUpLeftIcon,
  ArrowUpIcon,
  CircleIcon,
  CheckIcon,
  ArrowRightIcon,
  Bot,
  ImageIcon,
  Mic,
  FileIcon,
  Video,
} from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";

import { DicebearAvatar } from "../dicebear-avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { inboxService } from "@/services/inbox.service";
import { useInboxStore } from "@/store/useInboxStore";
import { Conversation } from "@/types/inbox";
import { SkeletonConversations } from "../skeletons/skeleton-conversations";

function LastMessagePreview({
  conversationId,
  propertyTitle,
  fallbackPreview,
}: {
  conversationId: string;
  propertyTitle?: string;
  fallbackPreview?: string;
}) {
  const { data: messages, isLoading } = useQuery<any[]>({
    queryKey: ["last-message", conversationId],
    queryFn: () => inboxService.getMessages(conversationId, { limit: 1 }),
    refetchInterval: 15000,
  });

  const lastMessage =
    messages && messages.length > 0 ? messages[messages.length - 1] : null;

  const isContact = lastMessage
    ? typeof lastMessage.sender === "string"
      ? lastMessage.sender === "user"
      : lastMessage.sender?.role === "user"
    : false;

  const isFromOperator = lastMessage ? !isContact : false;

  const renderPreview = () => {
    if (isLoading && !lastMessage) {
      return fallbackPreview || "...";
    }

    if (!lastMessage) {
      return fallbackPreview || "Sin mensajes";
    }

    const textOutput = lastMessage.text || lastMessage.content || "";

    let icon = null;
    let typeLabel = "Adjunto";
    switch (lastMessage.type) {
      case "image":
        icon = <ImageIcon className="h-3 w-3 shrink-0" />;
        typeLabel = "Imagen";
        break;
      case "audio":
        icon = <Mic className="h-3 w-3 shrink-0" />;
        typeLabel = "Audio";
        break;
      case "document":
        icon = <FileIcon className="h-3 w-3 shrink-0" />;
        typeLabel = "Documento";
        break;
      case "video":
        icon = <Video className="h-3 w-3 shrink-0" />;
        typeLabel = "Video";
        break;
    }

    if (icon || textOutput) {
      return (
        <span className="inline-flex items-center gap-1 truncate">
          {icon}
          <span className="truncate">{textOutput || typeLabel}</span>
        </span>
      );
    }

    return `[${lastMessage.type || typeLabel}]`;
  };

  return (
    <div className="flex w-0 grow items-center gap-1">
      {isFromOperator && (
        <CornerUpLeftIcon className="size-3 shrink-0 text-muted-foreground" />
      )}
      <span className="line-clamp-1 border-r border-border/30 pr-2">
        {propertyTitle ? `[${propertyTitle}] ` : ""}
        {renderPreview()}
      </span>
    </div>
  );
}

export function ConversationsPanel() {
  const {
    filters,
    setFilters,
    selectedConversationId,
    setSelectedConversationId,
  } = useInboxStore();
  const [search, setSearch] = useState("");

  const { data, isLoading, error } = useQuery<Conversation[]>({
    queryKey: ["conversations", filters.status, filters.priority],
    queryFn: () =>
      inboxService.getConversations({
        // Adapt query params to backend design if needed
        status: filters.status !== "all" ? filters.status : undefined,
        priority: filters.priority !== "all" ? filters.priority : undefined,
      }),
    refetchInterval: 10000, // Poll every 10s for new messages
  });

  const getAbrevDate = (dateParam: number) => {
    const date = new Date(dateParam);
    if (isToday(date)) {
      return format(date, "h:mm a").toLowerCase();
    } else if (isYesterday(date)) {
      return "Ayer";
    } else {
      return format(date, "dd/MM/yyyy");
    }
  };

  // Filtrado local por nombre
  const conversations = data || [];
  const filteredConversations = conversations.filter((c: Conversation) =>
    c.contact.name.toLowerCase().includes(search.toLowerCase()),
  );

  const StatusIcon = ({ status }: { status: string }) => {
    switch (status) {
      case "resolved":
        return (
          <div
            className={cn(
              "flex items-center justify-center rounded-full p-1.5 bg-[#3FB62F]",
            )}
          >
            <CheckIcon className="size-3 stroke-3 text-white" />
          </div>
        );
      case "human":
        return (
          <div
            className={cn(
              "flex items-center justify-center rounded-full p-1.5 bg-destructive",
            )}
          >
            <CircleIcon className="size-3 stroke-3 text-white" />
          </div>
        );
      default:
        return (
          <div
            className={cn(
              "flex items-center justify-center rounded-full p-1.5 bg-orange-500/80",
            )}
          >
            <Bot className="size-3 stroke-3 text-white" />
          </div>
        );
    }
  };

  return (
    <div className="flex h-full flex-col bg-white border-r">
      <div className="p-4 border-b">
        {/* <h2 className="text-xl font-semibold mb-4">Inbox</h2> */}
        <Tabs
          value={filters.status}
          className="w-full mb-3"
          onValueChange={(val) => setFilters({ status: val as any })}
        >
          <TabsList className="grid w-full grid-cols-3 h-9">
            <TabsTrigger value="all" className="text-xs">
              Todas
            </TabsTrigger>
            <TabsTrigger value="human" className="text-xs">
              Humano
            </TabsTrigger>
            <TabsTrigger value="ai" className="text-xs">
              Bot
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2 mb-3">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar cliente..."
              className="pl-8 h-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select
            value={filters.priority}
            onValueChange={(val: any) => setFilters({ priority: val })}
          >
            <SelectTrigger className="h-9 w-[110px] shrink-0 text-xs">
              <SelectValue placeholder="Prioridad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="urgent">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  Urgentes
                </div>
              </SelectItem>
              <SelectItem value="high">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-orange-500" />
                  Altas
                </div>
              </SelectItem>
              <SelectItem value="medium">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-yellow-500" />
                  Medias
                </div>
              </SelectItem>
              <SelectItem value="low">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-blue-500" />
                  Bajas
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <ScrollArea className="max-h-[calc(100vh-128.8px)]">
        {isLoading ? (
          <SkeletonConversations />
        ) : error ? (
          <div className="p-4 text-center text-sm text-red-500">
            Error al cargar las conversaciones
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            No se encontraron conversaciones
          </div>
        ) : (
          <div className="flex flex-col">
            {filteredConversations.map((conversation: any) => {
              return (
                <Link
                  href={`/admin/conversations/${conversation._id}`}
                  scroll={false}
                  key={conversation._id}
                  onClick={() => setSelectedConversationId(conversation._id)}
                  className={cn(
                    "relative flex cursor-pointer items-start gap-3 border-b border-border/50 p-3 w-full text-left hover:bg-accent/50 transition-colors group",
                    selectedConversationId === conversation._id && "bg-accent",
                  )}
                >
                  <div
                    className={cn(
                      "-translate-y-1/2 absolute top-1/2 left-0 h-[64%] w-1 rounded-br-full rounded-tr-full bg-primary transition-all duration-300 ease-in-out origin-center",
                      selectedConversationId === conversation._id
                        ? "scale-y-100 opacity-100"
                        : "scale-y-0 opacity-0",
                    )}
                  />
                  <DicebearAvatar
                    seed={conversation.contact.name}
                    unreadCount={conversation.unreadCount}
                    priority={conversation.priority}
                  />

                  <div className="flex flex-col flex-1 min-w-0 pr-1">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <span className="font-semibold text-[14px] truncate text-foreground/90">
                        {conversation.contact.name}
                      </span>
                      <span
                        className={cn(
                          "text-[11px] whitespace-nowrap",
                          conversation.unreadCount
                            ? "text-green-600 font-medium"
                            : "text-muted-foreground",
                        )}
                      >
                        {getAbrevDate(
                          conversation.lastMessageAt ||
                            conversation.updatedAt ||
                            conversation._creationTime,
                        )}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <LastMessagePreview
                        conversationId={conversation._id}
                        propertyTitle={conversation.propertyTitle}
                        fallbackPreview={conversation.lastMessagePreview}
                      />

                      {/* Círculo de Status */}
                      <StatusIcon status={conversation.status} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
