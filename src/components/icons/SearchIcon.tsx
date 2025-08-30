import React from "react";
import { cn } from "@/lib/utils";

interface SearchIconProps {
  size?: number;
  isDark?: boolean;
  className?: string;
}

export function SearchIcon({ size = 56, isDark = false, className }: SearchIconProps) {
  return (
    <div 
      className={cn(
        "rounded-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 cursor-pointer transition-all duration-200 active:scale-95",
        isDark && "bg-gray-800 hover:bg-gray-700",
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
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </div>
  );
}
