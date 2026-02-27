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
  Paperclip,
  ImageIcon,
  Mic,
  X,
  File as FileIcon,
} from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import { AudioRecorder } from "./audio-recorder";
import { CustomAudioPlayer } from "./custom-audio-player";
import { ImagePreviewModal } from "./image-preview-modal";
import { DocumentPreviewModal } from "./document-preview-modal";
import { ImageViewerModal, ChatImageItem } from "./image-viewer-modal";

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
import { generatePdfPreviewFromUrl } from "@/lib/pdf-preview";

const getDocumentIcon = (fileName: string) => {
  if (!fileName) return null;
  const ext = fileName.split(".").pop()?.toLowerCase() || "";
  if (["pdf"].includes(ext)) return "/icons/pdf.png";
  if (["doc", "docx"].includes(ext)) return "/icons/doc.png";
  if (["xls", "xlsx"].includes(ext)) return "/icons/xls.png";
  if (["txt"].includes(ext)) return "/icons/txt.png";
  return null;
};

export function ConversationView() {
  const { selectedConversationId } = useInboxStore();
  const queryClient = useQueryClient();
  const [inputText, setInputText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState<File[]>([]);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [viewerInitialIndex, setViewerInitialIndex] = useState<number | null>(
    null,
  );
  const [pdfThumbnails, setPdfThumbnails] = useState<Record<string, string>>(
    {},
  );
  const [pdfPageCounts, setPdfPageCounts] = useState<Record<string, number>>(
    {},
  );
  const [fileSizes, setFileSizes] = useState<Record<string, number>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  // Extract all images for the viewer gallery
  const chatImages: ChatImageItem[] = messages
    .filter((msg: any) => msg.type === "image" && msg.mediaUrl)
    .map((msg: any) => ({
      url: msg.mediaUrl,
      text: msg.content || msg.text || "",
    }));

  // Fetch PDF thumbnails automatically
  useEffect(() => {
    messages.forEach((msg: any) => {
      if (msg.type === "document" && msg.mediaUrl) {
        let extSource =
          msg.fileName ||
          msg.name ||
          (msg.mediaUrl.includes("?")
            ? msg.mediaUrl.split("/").pop()?.split("?")[0]
            : msg.mediaUrl.split("/").pop()) ||
          "Documento";

        const textContent = msg.content || msg.text || "";
        if (!extSource.includes(".") && textContent.includes(".")) {
          extSource = textContent;
        }

        const fileExt = extSource.includes(".")
          ? extSource.split(".").pop()?.toUpperCase()
          : "";

        if (fileExt === "PDF" && !pdfThumbnails[msg.mediaUrl]) {
          generatePdfPreviewFromUrl(msg.mediaUrl)
            .then((result) => {
              setPdfThumbnails((prev) => ({
                ...prev,
                [msg.mediaUrl]: result.thumbnail,
              }));
              setPdfPageCounts((prev) => ({
                ...prev,
                [msg.mediaUrl]: result.pageCount,
              }));
            })
            .catch((err) => {
              console.error("Failed to generate PDF thumbnail:", err);
            });
        }
      }
    });
  }, [messages, pdfThumbnails]);

  // Fetch document file sizes automatically
  useEffect(() => {
    messages.forEach((msg: any) => {
      if (msg.type === "document" && msg.mediaUrl && !fileSizes[msg.mediaUrl]) {
        let fetchUrl = msg.mediaUrl;
        if (msg.mediaUrl.startsWith("http")) {
          fetchUrl = `/api/cors-proxy?url=${encodeURIComponent(msg.mediaUrl)}`;
        }

        // Hacemos un HEAD para traer el peso sin descargar
        fetch(fetchUrl, { method: "HEAD" })
          .then((res) => {
            const size =
              res.headers.get("x-file-size") ||
              res.headers.get("content-length");
            if (size) {
              setFileSizes((prev) => ({
                ...prev,
                [msg.mediaUrl]: parseInt(size, 10),
              }));
            }
          })
          .catch((err) => console.error("Failed to fetch file size:", err));
      }
    });
  }, [messages, fileSizes]);

  // Mutations
  const sendMutation = useMutation({
    mutationFn: (args: {
      text?: string;
      file?: File;
      type: "text" | "image" | "audio" | "document";
    }) => inboxService.sendMessage(selectedConversationId!, args),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["messages", selectedConversationId],
      });
      setInputText("");
      setIsRecording(false);
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: () => inboxService.markMessagesAsRead(selectedConversationId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      queryClient.invalidateQueries({
        queryKey: ["messages", selectedConversationId],
      });
    },
  });

  const sendImagesMutation = useMutation({
    mutationFn: async (items: { file: File; caption: string }[]) => {
      // Send multiple images sequentially to maintain order and avoid overwhelming backend
      for (const item of items) {
        await inboxService.sendMessage(selectedConversationId!, {
          file: item.file,
          text: item.caption,
          type: "image",
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["messages", selectedConversationId],
      });
      setSelectedImages([]);
    },
  });

  const sendDocumentsMutation = useMutation({
    mutationFn: async (items: { file: File; caption: string }[]) => {
      // Send multiple documents sequentially
      for (const item of items) {
        await inboxService.sendMessage(selectedConversationId!, {
          file: item.file,
          text: item.caption,
          type: "document",
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["messages", selectedConversationId],
      });
      setSelectedDocuments([]);
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
    if (!inputText.trim()) return;
    if (sendMutation.isPending) return;

    sendMutation.mutate({ text: inputText, type: "text" });
  };

  const handleSendAudio = (audioBlob: Blob) => {
    let type = audioBlob.type || "audio/ogg";
    let ext = "ogg";

    // Standardize extensions and types for WhatsApp/yCloud compatibility
    if (type.includes("ogg")) {
      ext = "ogg";
      type = "audio/ogg"; // Bare type for WhatsApp
    } else if (type.includes("mp4") || type.includes("aac")) {
      ext = "m4a";
      type = "audio/aac"; // WhatsApp likes audio/aac for m4a files
    } else if (type.includes("mpeg")) {
      ext = "mp3";
      type = "audio/mpeg";
    } else if (type.includes("webm")) {
      ext = "webm";
      // In some cases, we might want to convert webm to ogg or something else,
      // but for now we keep it honest. If yCloud still fails webm, we'll know.
      type = "audio/webm";
    }

    const file = new File([audioBlob], `recording.${ext}`, {
      type: type,
    });
    sendMutation.mutate({ file, type: "audio" });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedDocuments(Array.from(e.target.files));
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImages(Array.from(e.target.files));
    }
    // clear input to allow selecting the same image again if needed
    if (imageInputRef.current) imageInputRef.current.value = "";
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

        <AIConversation className="max-h-[calc(100vh-139.95px)]">
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

        <div className="p-3 bg-background border-t">
          <div className="flex items-end gap-2 p-1 border rounded-lg bg-background overflow-hidden relative focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
            <AIInputTextarea
              disabled
              className="flex-1 min-h-[44px] resize-none pb-2 pt-3 pl-3 shadow-none focus-visible:ring-0 border-none rounded-none bg-transparent"
              placeholder="Escribe tu mensaje como un operador..."
            />
            <div className="flex items-center gap-1 shrink-0 pb-1.5 pr-2">
              <AIInputSubmit
                disabled
                onClick={() => {}}
                className="h-9 w-9 shrink-0"
              />
            </div>
          </div>
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
              }
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

      {/* Main Content Area (Messages + Input) */}
      <div className="flex flex-col flex-1 overflow-hidden relative">
        {/* Messages Area Using UI AI components */}
        <AIConversation className="max-h-[calc(100vh-139.95px)]">
          <AIConversationContent className="relative">
            {messages.map((msg: any) => {
              const isContact =
                typeof msg.sender === "string"
                  ? msg.sender === "user"
                  : msg.sender?.role === "user";

              const fromPos = isContact ? "assistant" : "user";

              const timeDate = msg._creationTime || msg.createdAt;
              const formattedTime = timeDate
                ? format(new Date(timeDate), "h:mm a", {
                    locale: es,
                  }).toLowerCase()
                : "";

              const isSystem =
                msg.sender === "system" || msg.sender?.role === "system";

              let extSource = "";
              if (msg.type === "document" && msg.mediaUrl) {
                const originalName =
                  msg.fileName ||
                  msg.name ||
                  (msg.mediaUrl.includes("?")
                    ? msg.mediaUrl.split("/").pop()?.split("?")[0]
                    : msg.mediaUrl.split("/").pop()) ||
                  "Documento";

                const textContent = msg.content || msg.text || "";
                extSource = originalName;
                if (!extSource.includes(".") && textContent.includes(".")) {
                  extSource = textContent;
                }
              }

              return (
                <AIMessage
                  key={msg._id}
                  from={fromPos}
                  className={cn(isSystem && "opacity-70 scale-95")}
                >
                  <AIMessageContent
                    className={cn(
                      msg.type === "document"
                        ? "bg-[#0b63f3] text-white border-transparent"
                        : isContact
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
                      <div
                        className="mb-2 max-w-sm rounded-md overflow-hidden border border-black/5 bg-black/5 cursor-pointer relative group"
                        onClick={() => {
                          const idx = chatImages.findIndex(
                            (img) => img.url === msg.mediaUrl,
                          );
                          setViewerInitialIndex(idx !== -1 ? idx : 0);
                        }}
                      >
                        <img
                          src={msg.mediaUrl}
                          alt="Image attachment"
                          className="object-contain max-h-64 w-full transition-all group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <span className="text-white text-xs font-medium px-3 py-1.5 bg-black/50 rounded-full backdrop-blur-sm shadow-sm ring-1 ring-white/20">
                            Ver foto
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Render Audio */}
                    {msg.type === "audio" && msg.mediaUrl && (
                      <div className="mb-1 -ml-1">
                        <CustomAudioPlayer
                          src={msg.mediaUrl}
                          isContact={isContact}
                          avatarSeed={
                            isContact
                              ? (conversation?.contact?.name ?? "user")
                              : "Agente"
                          }
                          timestamp={formattedTime}
                        />
                      </div>
                    )}

                    {/* Render Document */}
                    {msg.type === "document" &&
                      msg.mediaUrl &&
                      (() => {
                        const iconUrl = getDocumentIcon(extSource);
                        const fileExt = extSource.includes(".")
                          ? extSource.split(".").pop()?.toUpperCase()
                          : "DOC";

                        const sizeBytes = fileSizes[msg.mediaUrl];
                        let formattedSize = "?? kB";
                        if (sizeBytes) {
                          if (sizeBytes < 1024 * 1024)
                            formattedSize = `${Math.round(sizeBytes / 1024)} kB`;
                          else
                            formattedSize = `${(sizeBytes / (1024 * 1024)).toFixed(1)} MB`;
                        }

                        const pageCount = pdfPageCounts[msg.mediaUrl] || 1;
                        const fileSizeText = `${pageCount} ${pageCount === 1 ? "Pág" : "Págs"} • PDF • ${formattedSize}`;

                        const isPdf = fileExt === "PDF";

                        return (
                          <a
                            href={msg.mediaUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="flex flex-col mb-2 rounded-lg overflow-hidden border border-black/10 dark:border-white/10 shadow-sm max-w-[320px] transition-all group"
                          >
                            {/* WhatsApp Style Top Preview for PDFs */}
                            {isPdf && (
                              <div className="bg-white h-32 w-full flex items-center justify-center relative p-0 overflow-hidden border-b border-black/5 dark:border-white/5">
                                {pdfThumbnails[msg.mediaUrl] ? (
                                  <img
                                    src={pdfThumbnails[msg.mediaUrl]}
                                    className="w-full h-full object-cover origin-top hover:scale-105 transition-transform duration-300"
                                    alt="PDF Thumbnail"
                                  />
                                ) : (
                                  <>
                                    <span className="text-[10px] text-muted-foreground/50 font-medium absolute top-4 left-6">
                                      {extSource}
                                    </span>
                                  </>
                                )}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors pointer-events-none" />
                              </div>
                            )}

                            {/* Bottom Info Bar with improved readability */}
                            <div className="flex items-center gap-3 p-3 bg-white/60 dark:bg-black/40 hover:bg-white/80 dark:hover:bg-black/60 transition-colors backdrop-blur-sm">
                              <div className="h-10 w-10 shrink-0 bg-background rounded-md flex items-center justify-center overflow-hidden shadow-sm border border-black/5 dark:border-white/5">
                                {iconUrl ? (
                                  <img
                                    src={iconUrl}
                                    alt="doc icon"
                                    className="h-6 w-6 object-contain"
                                  />
                                ) : (
                                  <FileIcon className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
                                )}
                              </div>
                              <div className="flex flex-col min-w-0 flex-1">
                                <span className="truncate font-semibold text-[15px] text-neutral-900 dark:text-neutral-100 leading-tight">
                                  {extSource}
                                </span>
                                <span className="text-[12px] font-medium text-neutral-600 dark:text-neutral-400 mt-0.5">
                                  {isPdf
                                    ? fileSizeText
                                    : `${fileExt} Documento`}
                                </span>
                              </div>
                            </div>
                          </a>
                        );
                      })()}

                    {/* Text Content */}
                    {msg.content && msg.type !== "document" && (
                      <AIResponse className="whitespace-pre-wrap">
                        {msg.content}
                      </AIResponse>
                    )}
                    {msg.content &&
                      msg.type === "document" &&
                      msg.content !== extSource && (
                        <AIResponse className="whitespace-pre-wrap">
                          {msg.content}
                        </AIResponse>
                      )}

                    {msg.text && (
                      <AIResponse className="whitespace-pre-wrap">
                        {msg.text}
                      </AIResponse>
                    )}

                    {formattedTime && msg.type !== "audio" && (
                      <div
                        className={cn(
                          "flex mt-0.5",
                          isContact ? "justify-start" : "justify-end",
                        )}
                      >
                        <span
                          className={cn(
                            "text-[10px] font-medium leading-none",
                            isContact && msg.type !== "document"
                              ? "text-muted-foreground"
                              : "text-white/70 dark:text-blue-200/50",
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
        <div className="p-3 bg-background border-t shrink-0">
          {isRecording ? (
            <AudioRecorder
              onSend={handleSendAudio}
              onCancel={() => setIsRecording(false)}
              isSending={sendMutation.isPending}
            />
          ) : (
            <div className="flex flex-col gap-2">
              <div className="flex items-end gap-2 p-1 border rounded-lg bg-background overflow-hidden relative focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                <input
                  type="file"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
                />
                <input
                  type="file"
                  multiple
                  className="hidden"
                  ref={imageInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                />

                <div className="flex items-center gap-0.5 pb-1.5 pl-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-muted-foreground hover:text-foreground"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={conversation?.status === "resolved"}
                    title="Adjuntar Documento"
                  >
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-muted-foreground hover:text-foreground"
                    onClick={() => imageInputRef.current?.click()}
                    disabled={conversation?.status === "resolved"}
                    title="Adjuntar Imagen"
                  >
                    <ImageIcon className="h-4 w-4" />
                  </Button>
                </div>

                <AIInputTextarea
                  ref={textareaRef}
                  autoFocus
                  className="flex-1 min-h-[44px] resize-none pb-2 pt-3 pl-2 shadow-none focus-visible:ring-0 border-none rounded-none bg-transparent"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={
                    conversation?.status === "resolved" ||
                    sendMutation.isPending
                  }
                  placeholder={
                    conversation?.status === "resolved"
                      ? "Esta conversación ha sido resuelta"
                      : "Escribe tu mensaje como operador..."
                  }
                />

                <div className="flex items-center gap-1 shrink-0 pb-1.5 pr-1">
                  {!inputText.trim() && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                      onClick={() => setIsRecording(true)}
                      disabled={conversation?.status === "resolved"}
                      title="Enviar nota de voz"
                    >
                      <Mic className="h-5 w-5" />
                    </Button>
                  )}

                  {inputText.trim() && (
                    <AIInputSubmit
                      disabled={
                        conversation?.status === "resolved" ||
                        sendMutation.isPending
                      }
                      onClick={handleSend}
                      className="h-9 w-9 shrink-0 bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700"
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Image Preview WhatsApp Modal */}
        {selectedImages.length > 0 && (
          <ImagePreviewModal
            initialFiles={selectedImages}
            onClose={() => setSelectedImages([])}
            onSend={(items) => sendImagesMutation.mutate(items)}
            isSending={sendImagesMutation.isPending}
          />
        )}

        {/* Document Preview WhatsApp Modal */}
        {selectedDocuments.length > 0 && (
          <DocumentPreviewModal
            initialFiles={selectedDocuments}
            onClose={() => setSelectedDocuments([])}
            onSend={(items) => sendDocumentsMutation.mutate(items)}
            isSending={sendDocumentsMutation.isPending}
          />
        )}

        {/* Full Image Viewer Modal */}
        {viewerInitialIndex !== null && (
          <ImageViewerModal
            images={chatImages}
            initialIndex={viewerInitialIndex}
            onClose={() => setViewerInitialIndex(null)}
          />
        )}
      </div>
    </div>
  );
}
