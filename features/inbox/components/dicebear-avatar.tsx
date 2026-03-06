"use client";

import { glass, lorelei, initials, shapes } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import { useMemo } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const variants = {
  glass,
  lorelei,
  initials,
  shapes,
};

interface DicebearAvatarProps {
  seed: string;
  variant?: keyof typeof variants;
  size?: number;
  fontSize?: number; // For initials variant
  className?: string; // Applied as wrapper class
  avatarClassName?: string; // Applied specifically to the circular part
  badgeClassName?: string;
  imageUrl?: string;
  unreadCount?: number;
  priority?: "urgent" | "high" | "medium" | "low";
}

const getInitialsString = (name: string) => {
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
  variant = "glass",
  size = 44,
  fontSize,
  className,
  avatarClassName,
  badgeClassName,
  imageUrl,
  unreadCount,
  priority,
}: DicebearAvatarProps) {
  const avatarSrc = useMemo(() => {
    if (imageUrl) {
      return imageUrl;
    }

    // Cast to any to avoid complex TS union errors between different style options
    const avatar = createAvatar(variants[variant] as any, {
      seed: seed.toLowerCase().trim(),
      size,
      ...(fontSize ? { fontSize } : {}),
    });

    return avatar.toDataUri();
  }, [seed, variant, size, imageUrl, fontSize]);

  return (
    <div className={cn("relative shrink-0", className)}>
      <Avatar
        className={cn(
          "border border-black/5 dark:border-white/10 shadow-sm",
          avatarClassName,
        )}
        style={{ width: size, height: size }}
      >
        <AvatarImage alt="Avatar" src={avatarSrc} />
        {/* Fallback with initials if image fails or isn't generated yet */}
        <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
          {getInitialsString(seed)}
        </AvatarFallback>
      </Avatar>
      {Boolean(unreadCount && unreadCount > 0) && (
        <span
          className={cn(
            "absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-green-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-background z-10",
            badgeClassName,
          )}
        >
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
