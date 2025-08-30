"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  leftComponent?: React.ReactNode;
  centerComponent?: React.ReactNode;
  rightComponent?: React.ReactNode;
  className?: string;
}

export function Header({ 
  leftComponent, 
  centerComponent, 
  rightComponent, 
  className
}: HeaderProps) {
  return (
    <div 
      className={cn(
        "flex items-center justify-between px-4 py-3",
        className
      )}
    >
      {/* Left Component */}
      <div className="flex items-center justify-start w-14 h-14">
        {leftComponent}
      </div>
      
      {/* Center Component */}
      <div className="flex items-center justify-center flex-1">
        {centerComponent}
      </div>
      
      {/* Right Component */}
      <div className="flex items-center justify-end w-14 h-14">
        {rightComponent}
      </div>
    </div>
  );
}
