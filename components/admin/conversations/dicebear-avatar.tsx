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

export function DicebearAvatar({
  seed,
  size = 44,
  className,
  badgeClassName,
  imageUrl,
  unreadCount,
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
        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-green-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-background">
          {unreadCount}
        </span>
      )}
    </div>
  );
}
