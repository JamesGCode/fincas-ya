"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, Square, Trash2, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AudioRecorderProps {
  onSend: (audioBlob: Blob) => void;
  onCancel: () => void;
  isSending?: boolean;
}

export function AudioRecorder({
  onSend,
  onCancel,
  isSending = false,
}: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout>(null);

  // Comienza la grabación apenas se monta el componente
  useEffect(() => {
    startRecording();
    return () => {
      stopRecording();
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm",
      });

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm", // Generalmente webm en web
        });
        setAudioBlob(audioBlob);

        // Detener todas las pistas de audio para apagar el micrófono
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("Error accidiendo al micrófono:", error);
      onCancel();
    }
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const handleSend = () => {
    if (audioBlob) {
      onSend(audioBlob);
    } else if (isRecording) {
      // Si el usuario presiona enviar mientras graba, detenemos y enviamos en el mismo flujo
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.onstop = () => {
          const finalBlob = new Blob(audioChunksRef.current, {
            type: "audio/webm",
          });
          onSend(finalBlob);
          // Cleanup tracks
          mediaRecorderRef.current?.stream.getTracks().forEach((t) => t.stop());
        };
        mediaRecorderRef.current.stop();
        setIsRecording(false);
        if (timerRef.current) clearInterval(timerRef.current);
      }
    }
  };

  const handleCancel = () => {
    stopRecording();
    setAudioBlob(null);
    onCancel();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/20 px-3 py-2 rounded-2xl border border-emerald-200 dark:border-emerald-900 w-full animate-in fade-in slide-in-from-right-2 duration-300">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-full shrink-0"
        onClick={handleCancel}
        disabled={isSending}
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      <div className="flex items-center gap-3 flex-1 px-3">
        {isRecording ? (
          <div className="flex items-center justify-center gap-1.5 h-6">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <div className="w-1.5 h-3 rounded-full bg-red-500/70 animate-[bounce_1s_infinite_0ms]" />
            <div className="w-1.5 h-4 rounded-full bg-red-500/90 animate-[bounce_1s_infinite_200ms]" />
            <div className="w-1.5 h-2 rounded-full bg-red-500/70 animate-[bounce_1s_infinite_400ms]" />
            <div className="w-1.5 h-3 rounded-full bg-red-500/90 animate-[bounce_1s_infinite_100ms]" />
          </div>
        ) : (
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <Mic className="h-4 w-4" />
            <span className="text-xs font-medium">Grabación lista</span>
          </div>
        )}
        <span
          className={cn(
            "text-sm font-mono tracking-tighter tabular-nums mx-auto",
            isRecording ? "text-red-500 font-medium" : "text-muted-foreground",
          )}
        >
          {formatTime(recordingTime)}
        </span>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {isRecording ? (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-full"
            onClick={stopRecording}
            disabled={isSending}
          >
            <Square className="h-4 w-4 fill-current" />
          </Button>
        ) : null}

        <Button
          onClick={handleSend}
          disabled={isSending || (recordingTime === 0 && !audioBlob)}
          size="icon"
          className="h-8 w-8 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm"
        >
          {isSending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4 ml-0.5" />
          )}
        </Button>
      </div>
    </div>
  );
}
