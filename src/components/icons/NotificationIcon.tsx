import React from "react";
import { cn } from "@/lib/utils";

interface NotificationIconProps {
  size?: number;
  badgeCount?: number;
  isDark?: boolean;
  className?: string;
}

export function NotificationIcon({ 
  size = 56, 
  badgeCount = 3, 
  isDark = false, 
  className 
}: NotificationIconProps) {
  return (
    <div className="relative">
      <div 
        className={cn(
          "rounded-full flex items-center justify-center bg-gray-100 cursor-pointer transition-all duration-200 active:scale-95",
          isDark && "bg-gray-800",
          className
        )}
        style={{ width: size, height: size }}
      >
        <svg 
          className={cn(
            "w-6 h-6",
            isDark ? "text-gray-300" : "text-gray-600"
          )} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" 
          />
        </svg>
      </div>
      {badgeCount > 0 && (
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
          <span className="text-xs text-white font-medium">{badgeCount}</span>
        </div>
      )}
    </div>
  );
}
