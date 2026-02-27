"use client";

import { useState, useEffect, useRef } from "react";
import { X, Plus, Send, Loader2, FileIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { generatePdfPreview } from "@/lib/pdf-preview";

interface DocumentPreviewModalProps {
  initialFiles: File[];
  onClose: () => void;
  onSend: (items: { file: File; caption: string }[]) => void;
  isSending?: boolean;
}

interface MediaItem {
  id: string;
  file: File;
  caption: string;
}

export function DocumentPreviewModal({
  initialFiles,
  onClose,
  onSend,
  isSending = false,
}: DocumentPreviewModalProps) {
  const getDocumentIcon = (fileName: string) => {
    if (!fileName) return null;
    const ext = fileName.split(".").pop()?.toLowerCase() || "";
    if (["pdf"].includes(ext)) return "/icons/pdf.png";
    if (["doc", "docx"].includes(ext)) return "/icons/doc.png";
    if (["xls", "xlsx"].includes(ext)) return "/icons/xls.png";
    if (["txt"].includes(ext)) return "/icons/txt.png";
    return null;
  };
  const [items, setItems] = useState<MediaItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [pdfPreviews, setPdfPreviews] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose();
    }, 250);
  };

  useEffect(() => {
    if (initialFiles && initialFiles.length > 0) {
      const newItems = initialFiles.map((file) => ({
        id: Math.random().toString(36).substring(2, 9),
        file,
        caption: "",
      }));
      setItems(newItems);
      setCurrentIndex(0);

      // Generate previews for PDFs
      newItems.forEach(async (item) => {
        if (item.file.type === "application/pdf") {
          try {
            const dataUrl = await generatePdfPreview(item.file);
            setPdfPreviews((prev) => ({ ...prev, [item.id]: dataUrl }));
          } catch (error) {
            console.error("Failed to generate PDF preview:", error);
          }
        }
      });
    }
  }, [initialFiles]);

  const handleAddFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const addedFiles = Array.from(e.target.files);
      const newItems = addedFiles.map((file) => ({
        id: Math.random().toString(36).substring(2, 9),
        file,
        caption: "",
      }));
      setItems((prev) => [...prev, ...newItems]);
      setCurrentIndex(items.length);

      // Generate previews for newly added PDFs
      newItems.forEach(async (item) => {
        if (item.file.type === "application/pdf") {
          try {
            const dataUrl = await generatePdfPreview(item.file);
            setPdfPreviews((prev) => ({ ...prev, [item.id]: dataUrl }));
          } catch (error) {
            console.error("Failed to generate PDF preview:", error);
          }
        }
      });
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemove = (e: React.MouseEvent, idToRemove: string) => {
    e.stopPropagation();

    const indexToRemove = items.findIndex((i) => i.id === idToRemove);
    const newItems = items.filter((i) => i.id !== idToRemove);

    setItems(newItems);

    if (newItems.length === 0) {
      handleClose();
    } else {
      if (currentIndex >= newItems.length) {
        setCurrentIndex(newItems.length - 1);
      } else if (indexToRemove < currentIndex) {
        setCurrentIndex(currentIndex - 1);
      }
    }
  };

  const handleCaptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setItems((prev) => {
      const updated = [...prev];
      updated[currentIndex] = {
        ...updated[currentIndex],
        caption: e.target.value,
      };
      return updated;
    });
  };

  const handleSubmit = () => {
    if (isSending || items.length === 0) return;
    onSend(
      items.map((item) => ({
        file: item.file,
        caption: item.caption,
      })),
    );
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowRight") {
        setCurrentIndex((prev) => Math.min(items.length - 1, prev + 1));
      }
      if (e.key === "ArrowLeft") {
        setCurrentIndex((prev) => Math.max(0, prev - 1));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [items.length, onClose]);

  if (items.length === 0) return null;

  const currentItem = items[currentIndex];

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div
      className={cn(
        "absolute inset-0 z-50 overflow-hidden bg-muted backdrop-blur-sm",
        !isExiting
          ? "animate-in fade-in duration-300"
          : "animate-out fade-out duration-300",
      )}
    >
      <div
        className={cn(
          "flex flex-col h-full w-full",
          !isExiting
            ? "animate-in slide-in-from-bottom-24 duration-300"
            : "animate-out slide-out-to-bottom-24 duration-300",
        )}
      >
        {/* Header / Close Button */}
        <div className="absolute top-4 right-4 z-60">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="rounded-full text-foreground hover:bg-black/10 transition-colors"
            disabled={isSending}
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        {/* Top Centered Filename */}
        {currentItem && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-60 text-center pointer-events-none">
            <h3 className="text-[15px] font-semibold text-foreground max-w-[250px] sm:max-w-sm truncate">
              {currentItem.file.name}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {formatFileSize(currentItem.file.size)}
            </p>
          </div>
        )}

        {/* Main document preview */}
        <div className="flex-1 overflow-hidden relative flex flex-col items-center justify-center pt-20 pb-4 px-4 min-h-0 shrink">
          {currentItem && currentItem.file.type === "application/pdf" ? (
            <div className="relative w-full max-w-2xl h-full flex flex-col items-center justify-center overflow-hidden animate-in zoom-in-95 duration-200">
              {pdfPreviews[currentItem.id] ? (
                <img
                  src={pdfPreviews[currentItem.id]}
                  alt={`PDF preview of ${currentItem.file.name}`}
                  className="h-auto max-h-full max-w-full object-contain rounded-lg shadow-sm"
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-8 h-full">
                  <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
                  <p className="text-muted-foreground text-sm font-medium">
                    Generando vista previa...
                  </p>
                </div>
              )}
            </div>
          ) : currentItem ? (
            <div className="flex flex-col items-center justify-center p-8 bg-background/50 rounded-2xl border shadow-sm max-w-md w-full animate-in zoom-in-95 duration-200">
              <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                {getDocumentIcon(currentItem.file.name) ? (
                  <img
                    src={getDocumentIcon(currentItem.file.name)!}
                    alt="icon"
                    className="h-14 w-14 object-contain"
                  />
                ) : (
                  <FileIcon className="h-12 w-12 text-primary" />
                )}
              </div>
              <h3 className="text-xl font-semibold text-center text-foreground break-all line-clamp-2 mb-2">
                {currentItem.file.name}
              </h3>
              <p className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full text-center truncate w-full">
                {currentItem.file.type || "Documento"}
              </p>
            </div>
          ) : null}
        </div>

        {/* Footer controls */}
        <div className="bg-background border-t w-full shrink-0 flex flex-col">
          <div className="max-w-3xl w-full mx-auto px-4 pb-4 pt-4 flex flex-col gap-4">
            {/* Caption Input Wrapper */}
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-muted rounded-lg overflow-hidden flex items-center px-4 h-12 shadow-sm border focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 transition-all">
                <input
                  ref={inputRef}
                  type="text"
                  autoFocus
                  value={currentItem?.caption || ""}
                  onChange={handleCaptionChange}
                  placeholder="Escribe un mensaje"
                  className="w-full bg-transparent border-none text-foreground text-[15px] placeholder:text-muted-foreground focus:outline-none focus:ring-0"
                  disabled={isSending}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      if (document.activeElement === inputRef.current) {
                        handleSubmit();
                      }
                    }
                  }}
                />
              </div>
              <button
                onClick={handleSubmit}
                disabled={isSending}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 shadow-md"
              >
                {isSending ? (
                  <Loader2 className="h-5 w-5 text-white animate-spin" />
                ) : (
                  <Send className="h-5 w-5 text-white ml-0.5" />
                )}
              </button>
            </div>

            {/* Thumbnails row */}
            <div className="flex items-center justify-center pt-2 overflow-x-auto pb-2 scrollbar-hide gap-2">
              {items.map((item, idx) => (
                <div
                  key={item.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={cn(
                    "relative h-[52px] w-[52px] shrink-0 cursor-pointer overflow-hidden rounded-md border-2 transition-all shadow-sm bg-muted flex flex-col items-center justify-center gap-1",
                    currentIndex === idx
                      ? "border-primary scale-100"
                      : "border-border opacity-70 hover:opacity-100 scale-95 hover:scale-100",
                  )}
                  title={item.file.name}
                >
                  {getDocumentIcon(item.file.name) ? (
                    <img
                      src={getDocumentIcon(item.file.name)!}
                      alt="icon"
                      className={cn(
                        "h-7 w-7 object-contain",
                        currentIndex !== idx && "opacity-70 grayscale",
                      )}
                    />
                  ) : (
                    <FileIcon
                      className={cn(
                        "h-6 w-6",
                        currentIndex === idx
                          ? "text-primary"
                          : "text-muted-foreground",
                      )}
                    />
                  )}
                  {currentIndex === idx && (
                    <div
                      className="absolute top-0 right-0 p-1 cursor-pointer hover:bg-black/10 rounded-bl-md transition-colors bg-black/5"
                      onClick={(e) => handleRemove(e, item.id)}
                      title="Eliminar"
                    >
                      <X className="h-3.5 w-3.5 text-foreground drop-shadow-sm" />
                    </div>
                  )}
                </div>
              ))}

              {/* Add more thumbnails button */}
              <div
                className="flex h-[52px] w-[52px] shrink-0 cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-muted-foreground/30 text-muted-foreground hover:bg-muted hover:text-foreground hover:border-muted-foreground/50 transition-all scale-95 hover:scale-100"
                onClick={() => fileInputRef.current?.click()}
                title="Añadir más documentos"
              >
                <Plus className="h-6 w-6" />
              </div>
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
                className="hidden"
                ref={fileInputRef}
                onChange={handleAddFiles}
                disabled={isSending}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
