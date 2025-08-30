import React from "react";
import { cn } from "@/lib/utils";

interface TradeCardProps {
  username: string;
  avatar: string;
  token: string;
  type: "LONG" | "SHORT";
  leverage: string;
  profit: string;
  timeAgo: string;
  entryPrice?: string;
  markPrice?: string;
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
  entryPrice,
  markPrice,
  className,
}: TradeCardProps) {
  const isProfit = profit.includes("+");
  const profitColor = isProfit ? "text-green-500" : "text-red-500";

  return (
    <div
      className={cn(
        "border-0 shadow-sm bg-gray-100 rounded-2xl p-4",
        className
      )}
    >
      {/* Header Row */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
            <span className="text-white text-lg">⬥</span>
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-lg">${token}</p>
            <p className="text-sm text-gray-500">{timeAgo}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-gray-900 font-medium">{type}</span>
          <span className="text-gray-900">↗</span>
          <div className="text-right">
            <p className="text-sm text-gray-600">{leverage}</p>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-left">
          <p className="text-lg font-semibold text-gray-900">
            {entryPrice || "0.369"}
          </p>
          <p className="text-sm text-gray-500">Entry price</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-900">
            {markPrice || "0.372"}
          </p>
          <p className="text-sm text-gray-500">Mark price</p>
        </div>
        <div className="text-right">
          <p className={cn("text-lg font-semibold", profitColor)}>{profit}</p>
          <p className="text-sm text-gray-500">Earn</p>
        </div>
        <div className="ml-2">
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
