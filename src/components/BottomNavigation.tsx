"use client";

import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface BottomNavigationProps {
  isDark?: boolean;
}

interface NavItem {
  id: string;
  label: string;
  icon: (isActive: boolean, isDark: boolean) => JSX.Element;
  path: string;
}

export function BottomNavigation({ isDark = false }: BottomNavigationProps) {
  const router = useRouter();
  const pathname = usePathname();

  const navItems: NavItem[] = [
    {
      id: "home",
      label: "Home",
      path: "/",
      icon: (isActive, isDark) => (
        <svg 
          className={cn(
            "w-6 h-6",
            isActive 
              ? (isDark ? "text-blue-400" : "text-blue-500") 
              : (isDark ? "text-gray-400" : "text-gray-500")
          )} 
          fill={isActive ? "currentColor" : "none"} 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={isActive ? 0 : 2} 
            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
          />
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={isActive ? 0 : 2} 
            d="M8 21V9a2 2 0 012-2h4a2 2 0 012 2v12"
          />
        </svg>
      ),
    },
    {
      id: "portfolio",
      label: "Portfolio", 
      path: "/portfolio",
      icon: (isActive, isDark) => (
        <svg 
          className={cn(
            "w-6 h-6",
            isActive 
              ? (isDark ? "text-blue-400" : "text-blue-500") 
              : (isDark ? "text-gray-400" : "text-gray-500")
          )} 
          fill={isActive ? "currentColor" : "none"} 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={isActive ? 0 : 2} 
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
    },
    {
      id: "trades",
      label: "Trades",
      path: "/trades", 
      icon: (isActive, isDark) => (
        <svg 
          className={cn(
            "w-6 h-6",
            isActive 
              ? (isDark ? "text-blue-400" : "text-blue-500") 
              : (isDark ? "text-gray-400" : "text-gray-500")
          )} 
          fill={isActive ? "currentColor" : "none"} 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={isActive ? 0 : 2} 
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          />
        </svg>
      ),
    },
    {
      id: "profile",
      label: "Profile",
      path: "/profile",
      icon: (isActive, isDark) => (
        <svg 
          className={cn(
            "w-6 h-6",
            isActive 
              ? (isDark ? "text-blue-400" : "text-blue-500") 
              : (isDark ? "text-gray-400" : "text-gray-500")
          )} 
          fill={isActive ? "currentColor" : "none"} 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={isActive ? 0 : 2} 
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
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
      <div className="flex items-center justify-around px-6 py-2 h-16 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          
          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.path)}
              className={cn(
                "flex flex-col items-center justify-center p-2 min-w-[60px] transition-colors",
                "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-lg"
              )}
            >
              <div className="mb-1">
                {item.icon(isActive, isDark)}
              </div>
              <span 
                className={cn(
                  "text-xs font-medium",
                  isActive 
                    ? (isDark ? "text-blue-400" : "text-blue-500") 
                    : (isDark ? "text-gray-400" : "text-gray-500")
                )}
              >
                {item.label}
              </span>
              {isActive && (
                <div 
                  className={cn(
                    "w-4 h-0.5 rounded-full mt-1",
                    isDark ? "bg-blue-400" : "bg-blue-500"
                  )}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
