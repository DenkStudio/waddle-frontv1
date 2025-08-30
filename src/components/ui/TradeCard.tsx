import React, { useState } from "react";
import { Trade } from "@/types";
import Image from "next/image";

interface TradeCardProps {
  trade: Trade;
}

const TradeCard: React.FC<TradeCardProps> = ({ trade }) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="relative rounded-[40px] bg-neutral-100 px-6 py-4 md:px-10 md:py-10">
      {/* Top row */}
      <div className="mb-2 flex items-start justify-between">
        {/* Left: asset */}
        <div className="flex items-center gap-4">
          {/* Logo */}
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black">
            {!imageError ? (
              <Image
                src={trade.img}
                alt={trade.token}
                width={48}
                height={48}
                onError={handleImageError}
                unoptimized
              />
            ) : (
              <div className="text-white text-lg font-bold">
                {trade.token.charAt(0)}
              </div>
            )}
          </div>

          <div className="leading-tight">
            <h2 className="text-2xl font-medium tracking-tight text-black md:text-4xl">
              {trade.token}
            </h2>
            <p className=" text-sm text-neutral-500">{trade.timeAgo}</p>
          </div>
        </div>

        {/* Right: position */}
        <div className="text-right leading-tight">
          <div className="flex items-center justify-end gap-2">
            <span className="text-3xl font-semibold tracking-tight text-black md:text-4xl">
              {trade.type}
            </span>
            {/* up-right arrow */}
            <svg
              className="h-5 w-5 text-black"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M16.293 6H9.5a1 1 0 0 0 0 2h4.586L6.293 15.793a1 1 0 1 0 1.414 1.414L15.5 9.414V14a1 1 0 1 0 2 0V7.707A1.707 1.707 0 0 0 16.293 6z" />
            </svg>
          </div>
          <p className="mt-1 text-sm text-neutral-500">{trade.leverage}</p>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-[20px] bg-white px-5 py-2">
          <p className="text-lg font-medium text-black">0.369</p>
          <p className=" text-sm text-neutral-500">Entry price</p>
        </div>

        <div className="rounded-[20px] bg-white px-5 py-2">
          <p className="text-lg font-medium text-black">0.372</p>
          <p className=" text-sm text-neutral-500">Mark price</p>
        </div>

        <div className="rounded-[20px] bg-white px-5 py-2">
          <p className="text-lg font-medium text-emerald-600">{trade.profit}</p>
          <p className=" text-sm text-neutral-500">Earn</p>
        </div>
      </div>
    </div>
  );
};

export default TradeCard;
