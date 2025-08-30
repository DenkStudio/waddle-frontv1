import React from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface ProfileAvatarProps {
  size?: number;
  isDark?: boolean;
  className?: string;
}

export function ProfileAvatar({ size = 56, isDark = false, className }: ProfileAvatarProps) {
  return (
    <div 
      className={cn(
        "rounded-full flex items-center justify-center border-2 border-gray-200 cursor-pointer transition-all duration-200 active:scale-95",
        className
      )}
      style={{ width: size, height: size }}
    >
      <Image src="/images/profile.png" alt="Profile" width={size} height={size} />
    </div>
  );
}
