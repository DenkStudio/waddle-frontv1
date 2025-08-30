import React from "react";
import { cn } from "@/lib/utils";
import { TokenLogo } from "./TokenLogo";
import Image from "next/image";

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
        "w-full border-0 shadow-sm bg-gray-100 rounded-[40px] py-4 px-6",
        className
      )}
    >
      {/* Header Row */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-3">
          <TokenLogo symbol={token} size="lg" />
          <div>
            <p className="font-bold text-gray-900 text-xl">${token}</p>
            <p className="text-sm text-gray-500">{timeAgo}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center space-x-1">
            <span className="text-gray-900 font-bold text-xl">{type}</span>
            <Image
              src="/logos/arrow.svg"
              alt="arrow-up"
              width={16}
              height={16}
              className={cn(
                "transition-transform duration-200",
                type === "SHORT" ? "rotate-180" : ""
              )}
            />
          </div>
          <p className="text-sm text-gray-600">{leverage}</p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="flex items-center justify-between space-x-2 w-full">
        <div className="bg-gray-200 rounded-xl px-3 py-2 flex-1 ">
          <p className="text-md font-normal text-gray-900 text-center">
            {entryPrice}
          </p>
          <p className="text-sm text-gray-500 text-center ">Entry price</p>
        </div>
        <div className="bg-gray-200 rounded-xl px-3 py-2 flex-1 ">
          <p className="text-md font-normal text-gray-900 text-center">
            {markPrice}
          </p>
          <p className="text-sm text-gray-500 text-center ">Mark price</p>
        </div>
        <div className="bg-gray-200 rounded-xl px-3 py-2 flex-1 ">
          <p className={cn("text-md font-normal text-center", profitColor)}>
            {profit}
          </p>
          <p className="text-sm text-gray-500 text-center ">Earn</p>
        </div>
        <div className="ml-3 flex items-center"></div>
      </div>
    </div>
  );
}
