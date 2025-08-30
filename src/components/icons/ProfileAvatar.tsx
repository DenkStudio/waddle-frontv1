import React from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface ProfileAvatarProps {
  size?: number;
  className?: string;
  badgeCount?: number;
}

export function ProfileAvatar({ 
  size = 56, 
  className,
  badgeCount 
}: ProfileAvatarProps) {
  return (
    <div className="relative">
      <div 
        className={cn(
          "rounded-full flex items-center justify-center border-2 border-gray-200 cursor-pointer transition-all duration-200 active:scale-95 overflow-hidden",
          className
        )}
        style={{ width: size, height: size }}
      >
        <Image 
          src="/images/profile.png" 
          alt="Profile" 
          width={size} 
          height={size}
          className="rounded-full object-cover"
        />
      </div>
      {badgeCount && badgeCount > 0 && (
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
          <span className="text-xs text-white font-medium">{badgeCount}</span>
        </div>
      )}
    </div>
  );
}
