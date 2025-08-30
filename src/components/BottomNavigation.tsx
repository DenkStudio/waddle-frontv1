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
  icon: (isActive: boolean, isDark: boolean) => React.ReactElement;
  path: string;
  isCenter?: boolean;
}

export function BottomNavigation({ isDark = false }: BottomNavigationProps) {
  const router = useRouter();
  const pathname = usePathname();

  const navItems: NavItem[] = [
    {
      id: "menu",
      path: "/",
      icon: (isActive, isDark) => (
        <CustomMenuIcon isActive={isActive} isDark={isDark} />
      ),
    },
    {
      id: "shorts",
      path: "/feed",
      isCenter: true,
      icon: (isActive, isDark) => (
        <CustomShortsIcon isActive={isActive} isDark={isDark} />
      ),
    },
    {
      id: "share",
      path: "/holdings",
      icon: (isActive, isDark) => (
        <CustomShareIcon isActive={isActive} isDark={isDark} />
      ),
    },
  ];

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <div className="w-full backdrop-blur-md fixed bottom-0 left-0 right-0 z-50 pb-4 ">
      <div
        className={cn(
          isDark
            ? "bg-gray-900/95 border-gray-700"
            : "bg-gray-50 border-gray-200 w-fit mx-auto rounded-full"
        )}
      >
        <div className="flex items-center justify-center gap-8 px-8 py-4 max-w-md mx-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.path;

            if (item.isCenter) {
              return (
                <div
                  key={item.id}
                  onClick={() => handleNavigation(item.path)}
                  className={cn(
                    "w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200",
                    "cursor-pointer select-none active:scale-90 active:duration-75",
                    "outline-none border-none",
                    isActive
                      ? "bg-blue-500"
                      : isDark
                      ? "bg-gray-800"
                      : "bg-gray-100"
                  )}
                  style={{
                    WebkitTapHighlightColor: "transparent",
                    outline: "none",
                    border: "none",
                  }}
                >
                  {item.icon(isActive, isDark)}
                </div>
              );
            }

            // Small icons - 48x48
            return (
              <div
                key={item.id}
                onClick={() => handleNavigation(item.path)}
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200",
                  "cursor-pointer select-none active:scale-90 active:duration-75",
                  "outline-none border-none",
                  isDark ? "bg-gray-800" : "bg-gray-100"
                )}
                style={{
                  WebkitTapHighlightColor: "transparent",
                  outline: "none",
                  border: "none",
                }}
              >
                {item.icon(isActive, isDark)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
