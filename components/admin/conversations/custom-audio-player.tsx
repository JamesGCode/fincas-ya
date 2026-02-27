"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, Mic, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { DicebearAvatar } from "./dicebear-avatar";

interface CustomAudioPlayerProps {
  src: string;
  className?: string;
  isContact?: boolean;
  avatarSeed?: string;
  timestamp?: string;
}

// Fixed pseudo-random pattern for the waveform look
const waveformPattern = [
  25, 30, 40, 50, 45, 60, 80, 70, 50, 40, 30, 25, 30, 45, 65, 95, 75, 55, 35,
  25, 20, 30, 50, 70, 85, 75, 55, 40, 30, 20, 25, 35, 50, 40, 30,
];

export function CustomAudioPlayer({
  src,
  className,
  isContact = false,
  avatarSeed = "user",
  timestamp,
}: CustomAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioData = () => {
      if (audio.duration && audio.duration !== Infinity) {
        setDuration(audio.duration);
      }
    };
    const setAudioTime = () => setCurrentTime(audio.currentTime);
    const handleEnd = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      audio.currentTime = 0;
    };

    audio.addEventListener("loadedmetadata", setAudioData);
    audio.addEventListener("loadeddata", setAudioData);
    audio.addEventListener("timeupdate", setAudioTime);
    audio.addEventListener("ended", handleEnd);

    // Initial check for duration if already loaded
    if (
      audio.readyState >= 1 &&
      audio.duration &&
      audio.duration !== Infinity
    ) {
      setDuration(audio.duration);
    }

    return () => {
      audio.removeEventListener("loadedmetadata", setAudioData);
      audio.removeEventListener("loadeddata", setAudioData);
      audio.removeEventListener("timeupdate", setAudioTime);
      audio.removeEventListener("ended", handleEnd);
    };
  }, [src]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  const togglePlaybackSpeed = () => {
    const speeds = [1, 1.5, 2];
    const currentIndex = speeds.indexOf(playbackSpeed);
    const nextIndex = (currentIndex + 1) % speeds.length;
    setPlaybackSpeed(speeds[nextIndex]);
  };

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(console.error);
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const time = Number(e.target.value);
    audio.currentTime = time;
    setCurrentTime(time);
  };

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div
      className={cn(
        "flex items-start gap-3 min-w-[280px] sm:min-w-[310px] max-w-full relative",
        className,
      )}
    >
      <audio ref={audioRef} src={src} preload="metadata" />

      {/* Avatar Section - Only show if contact sent it */}
      {isContact && (
        <div className="relative pt-1 shrink-0">
          <DicebearAvatar seed={avatarSeed} size={48} className="opacity-95" />
          <div className="absolute -bottom-1 -right-1 bg-background dark:bg-zinc-900 rounded-full p-0.5 shadow-sm border border-border flex items-center justify-center">
            <Mic className="h-3 w-3 text-emerald-500 fill-emerald-500" />
          </div>
        </div>
      )}

      {/* Player Controls */}
      <div className={cn("flex flex-col flex-1", isContact ? "pl-1" : "pl-0")}>
        <div className="flex items-center gap-3 w-full">
          {/* Play/Pause */}
          <button
            onClick={togglePlayPause}
            className={cn(
              "hover:scale-110 active:scale-95 transition-all mt-[14px] shrink-0 h-8 w-8 flex items-center justify-center",
              isContact
                ? "text-neutral-500 dark:text-neutral-400"
                : "text-white",
            )}
          >
            {isPlaying ? (
              <Pause className="h-7 w-7 fill-current" />
            ) : (
              <Play className="h-7 w-7 fill-current ml-0.5" />
            )}
          </button>

          {/* Waveform wrapper */}
          <div className="relative flex-1 h-[42px] mt-2 w-full">
            {/* Waveform bars */}
            <div className="absolute inset-0 flex items-center justify-between gap-[2px] h-full pointer-events-none px-1">
              {waveformPattern.map((h, i) => {
                const progress = duration > 0 ? currentTime / duration : 0;
                const isPlayed = i / waveformPattern.length <= progress;
                return (
                  <div
                    key={i}
                    className={cn(
                      "w-[3px] rounded-full transition-colors",
                      isPlayed
                        ? isContact
                          ? "bg-emerald-500"
                          : "bg-white"
                        : isContact
                          ? "bg-emerald-500/30 dark:bg-emerald-500/20"
                          : "bg-white/30",
                    )}
                    style={{ height: `${h}%` }}
                  />
                );
              })}
            </div>

            {/* Range Slider Overlay */}
            <input
              type="range"
              min={0}
              max={duration || 100}
              step={0.1}
              value={currentTime}
              onChange={handleSeek}
              title="Buscar"
              className={cn(
                "w-full h-full absolute inset-0 appearance-none bg-transparent cursor-pointer z-10 px-1",
                "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4",
                "[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white/40",
                "[&::-webkit-slider-runnable-track]:bg-transparent",
                isContact
                  ? "[&::-webkit-slider-thumb]:bg-emerald-500"
                  : "[&::-webkit-slider-thumb]:bg-sky-400",
              )}
            />
          </div>

          {/* Speed Toggle Button */}
          <button
            onClick={togglePlaybackSpeed}
            className={cn(
              "px-1.5 h-6 min-w-[34px] rounded-full text-[10px] font-bold transition-all hover:bg-white/10 active:scale-95 mt-[14px] flex items-center justify-center shrink-0 border",
              isContact
                ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700"
                : "bg-white/15 text-white border-white/30 shadow-sm",
            )}
          >
            {playbackSpeed}x
          </button>
        </div>

        {/* Timestamps */}
        <div
          className={cn(
            "flex items-center w-full justify-between -mt-0.5",
            isContact ? "pl-[48px]" : "pl-1",
          )}
        >
          <span
            className={cn(
              "text-[11px] font-medium transition-colors",
              isContact ? "text-muted-foreground" : "text-white/80",
            )}
          >
            {formatTime(currentTime > 0 ? currentTime : duration)}
          </span>

          {timestamp && (
            <div className="flex items-center gap-1 opacity-90">
              <span
                className={cn(
                  "text-[10px] font-medium",
                  isContact ? "text-muted-foreground" : "text-white/80",
                )}
              >
                {timestamp}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
