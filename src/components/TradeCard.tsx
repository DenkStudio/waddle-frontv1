import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface TradeCardProps {
  username: string;
  avatar: string;
  token: string;
  type: "LONG" | "SHORT";
  leverage: string;
  profit: string;
  timeAgo: string;
  className?: string;
}

export function TradeCard({
  username,
  avatar,
  token,
  type,
  leverage,
  profit,
  timeAgo,
  className
}: TradeCardProps) {
  const isProfit = profit.includes("+");
  const profitColor = isProfit ? "text-green-500" : "text-red-500";

  return (
    <Card className={cn("border-0 shadow-none bg-gray-100 rounded-[40px]", className)}>
      <CardContent className="ps-6 py-[14px]">
        {/* Header: Avatar, Username, Time, Profit */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
              <span className="text-xl">{avatar}</span>
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-base">{username}</p>
              <p className="text-sm text-gray-500">{timeAgo}</p>
            </div>
          </div>
          <div className="text-right">
          <span className={cn(
              "px-3 py-1.5 text-sm rounded-full flex items-center",
              "bg-white"
            )}>
              <p className={cn("text-lg font-semibold", profitColor)}>{profit}</p>
            </span>
          </div>
        </div>
        
        {/* Token Info and Actions */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center space-x-3">
          <span className={cn(
              "px-3 py-1.5 text-sm rounded-full flex items-center",
              "bg-white text-black" 
            )}>
              {token}
            </span>
            <span className={cn(
              "px-3 py-1.5 text-sm rounded-full flex items-center",
              type === "LONG" 
                ? "bg-green-500 text-white" 
                : "bg-red-500 text-white"
            )}>
              {type === "LONG" ? "LONG" : "SHORT"}
            </span>
            <span className={cn(
              "px-3 py-1.5 text-sm rounded-full flex items-center",
              "bg-white text-black" 
            )}>
              {leverage}
            </span>
          </div>
          
          {/* Bookmark Icon */}
          <div className="flex items-center space-x-3">
            <button className="p-2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Bottom Actions */}
        <div className="flex items-center space-x-3">
          <Button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white rounded-full py-3 h-12">
            View trade
          </Button>
          
          {/* Share Button */}
          <button 
            className="w-12 h-12 bg-gray-300 hover:bg-gray-400 rounded-full flex items-center justify-center transition-colors duration-200"
            style={{ 
              WebkitTapHighlightColor: 'transparent',
              outline: 'none',
              border: 'none'
            }}
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
              />
            </svg>
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
