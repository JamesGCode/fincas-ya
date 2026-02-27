"use client";

import { glass } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import { useMemo } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface DicebearAvatarProps {
  seed: string;
  size?: number;
  className?: string;
  badgeClassName?: string;
  imageUrl?: string;
  unreadCount?: number;
  priority?: "urgent" | "high" | "medium" | "low";
}

const getInitials = (name: string) => {
  return name
    .trim()
    .split(/\s+/)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

// Priority Colors definition
const priorityColors = {
  urgent: "bg-red-500",
  high: "bg-orange-500",
  medium: "bg-yellow-500",
  low: "bg-blue-500",
};

export function DicebearAvatar({
  seed,
  size = 44,
  className,
  badgeClassName,
  imageUrl,
  unreadCount,
  priority,
}: DicebearAvatarProps) {
  const avatarSrc = useMemo(() => {
    if (imageUrl) {
      return imageUrl;
    }

    const avatar = createAvatar(glass, {
      seed: seed.toLowerCase().trim(),
      size,
    });

    return avatar.toDataUri();
  }, [seed, size, imageUrl]);

  return (
    <div className={cn("relative shrink-0", className)}>
      <Avatar
        className={cn(
          "border border-black/5 dark:border-white/10 shadow-sm",
          className,
        )}
        style={{ width: size, height: size }}
      >
        <AvatarImage alt="Avatar" src={avatarSrc} />
        {/* Fallback with initials if image fails or isn't generated yet */}
        <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
          {getInitials(seed)}
        </AvatarFallback>
      </Avatar>

      {Boolean(unreadCount && unreadCount > 0) && (
        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-green-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-background z-10">
          {unreadCount}
        </span>
      )}

      {/* Priority Flag */}
      {priority && priorityColors[priority] && (
        <span
          className={cn(
            "absolute -bottom-0.5 -right-0.5 flex h-3 w-3 items-center justify-center rounded-full shadow-sm ring-2 ring-background z-10",
            priorityColors[priority],
          )}
          title={`Prioridad: ${priority}`}
        />
      )}
    </div>
  );
}
