"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import CustomMenuIcon from "./icons/CustomMenuIcon";
import CustomShareIcon from "./icons/CustomShareIcon";
import CustomShortsIcon from "./icons/CustomShortsIcon";

interface BottomNavigationProps {
  isDark?: boolean;
}

interface NavItem {
  id: string;
  icon: (isActive: boolean, isDark: boolean, width: number, height: number) => React.ReactElement;
  path: string;
  isCenter?: boolean;
}

export function BottomNavigation({ isDark = false }: BottomNavigationProps) {
  const router = useRouter();
  const pathname = usePathname();

  const navItems: NavItem[] = [
    {
      id: "menu",
      path: "/menu",
      icon: (isActive, isDark, width, height) => <CustomMenuIcon isActive={isActive} isDark={isDark} width={width} height={height} />,
    },
    {
      id: "shorts",
      path: "/shorts",
      isCenter: true,
      icon: (isActive, isDark, width, height) => <CustomShortsIcon isActive={isActive} isDark={isDark} width={width} height={height} />,
    },
    {
      id: "share",
      path: "/share",
      icon: (isActive, isDark, width, height) => <CustomShareIcon isActive={isActive} isDark={isDark} width={width} height={height} />,
    },
  ];

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <div 
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 border-t backdrop-blur-md",
        isDark 
          ? "bg-gray-900/95 border-gray-700" 
          : "bg-white/95 border-gray-200"
      )}
    >
      <div className="flex items-center justify-center gap-12 px-8 py-4 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          
          if (item.isCenter) {
            return (
              <div
                key={item.id}
                onClick={() => handleNavigation(item.path)}
                className={cn(
                  "w-16 h-16 rounded-full flex items-center justify-center cursor-pointer",
                  "transition-all duration-200 transform active:animate-bounce-subtle",
                  "hover:scale-105 active:scale-95",
                  isActive 
                    ? "bg-blue-500 hover:bg-blue-600" 
                    : (isDark 
                        ? "bg-gray-800 hover:bg-gray-700" 
                        : "bg-gray-100 hover:bg-gray-200")
                )}
              >
                {item.icon(isActive, isDark, 35, 30)}
              </div>
            );
          }
          
          // Small icons - 48x48
          return (
            <div
              key={item.id}
              onClick={() => handleNavigation(item.path)}
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center cursor-pointer",
                "transition-all duration-200 transform active:animate-bounce-subtle",
                "hover:scale-110 active:scale-90",
                isDark 
                  ? "bg-gray-800 hover:bg-gray-700" 
                  : "bg-gray-100 hover:bg-gray-200"
              )}
            >
              {item.icon(isActive, isDark, 24, 24)}
            </div>
          );
        })}
      </div>
    </div>
  );
}
