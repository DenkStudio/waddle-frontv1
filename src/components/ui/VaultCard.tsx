"use client";

import React from "react";
import Image from "next/image";
import { Button } from "./button";

export interface VaultCardProps {
  title?: string;
  username?: string;
  liquidity?: string;
  yield?: string;
  timeAgo?: string;
  earnings?: string;
  invested?: string;
  since?: string;
  variant?: "dark" | "light";
  onViewVault?: () => void;
  onShare?: () => void;
  className?: string;
}

export default function VaultCard({
  title = "Insiders Club",
  username = "@cryptowhale",
  liquidity = "+$52m",
  yield: yieldValue = "+12.5%",
  timeAgo = "91 days ago",
  earnings = "+$108.9",
  invested = "4203.48",
  since = "3mo ago",
  variant = "dark",
  onViewVault,
  onShare,
  className = "",
}: VaultCardProps) {
  if (variant === "light") {
    return (
      <div
        className={`relative rounded-[40px] bg-gray-100  overflow-hidden ${className}`}
      >
        <div className="relative py-4 px-6">
          {/* Header section */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-lime-400 flex items-center justify-center">
                <span className="text-black font-bold text-sm">(in)</span>
              </div>
              <div>
                <h3 className="text-black font-bold text-xl leading-6">
                  {title}
                </h3>
                <p className="text-blue-600 text-sm">{username}</p>
              </div>
            </div>

            <svg
              className="w-5 h-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path d="M9 5l7 7-7 7" />
            </svg>
          </div>

          {/* Statistics section */}
          <div className="flex gap-3 mb-4">
            <div className="flex-1 text-center p-2 rounded-2xl bg-white ">
              <div className="text-green-600 font-medium text-lg">
                {earnings}
              </div>
              <div className="text-gray-500 text-sm">Earnings</div>
            </div>
            <div className="flex-1 text-center p-2 rounded-2xl bg-white ">
              <div className="text-black font-medium text-lg">{invested}</div>
              <div className="text-gray-500 text-sm">Invested</div>
            </div>
            <div className="flex-1 text-center p-2 rounded-2xl bg-white ">
              <div className="text-black font-medium text-lg">{since}</div>
              <div className="text-gray-500 text-sm">Since</div>
            </div>
          </div>

          {/* Action buttons section */}
          <div className="flex items-center gap-3">
            <Button
              variant="gradient-blue"
              onClick={onViewVault}
              className="flex-1 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold"
            >
              View vault
            </Button>

            <button
              aria-label="Chat"
              className="h-12 w-12 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800 transition"
              onClick={onShare}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Dark variant (original design)
  return (
    <div
      className={`relative rounded-[40px] border border-white/20 bg-black/50 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,.8)] overflow-hidden ${className}`}
    >
      {/* Background gradients and effects */}
      <div className="pointer-events-none absolute inset-0 rounded-[40px] bg-[linear-gradient(180deg,rgba(255,255,255,.10)_0%,rgba(255,255,255,.04)_35%,rgba(0,0,0,.40)_100%)]" />
      <div className="pointer-events-none absolute inset-0 rounded-[40px] ring-1 ring-inset ring-white/5" />
      <div className="pointer-events-none absolute inset-0 rounded-[40px] bg-[radial-gradient(120%_140%_at_50%_120%,transparent,rgba(0,0,0,.35))]" />

      <div className="relative p-6">
        {/* Header section */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center">
              <svg
                className="h-6 w-6 text-black"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C7.03 2 3 6.03 3 11s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 3.5c1.65 0 3 1.35 3 3 0 2.25-3 5-3 5s-3-2.75-3-5c0-1.65 1.35-3 3-3z" />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-semibold text-xl leading-6">
                {title}
              </h3>
              <p className="text-white/70 text-[15px] leading-5">{username}</p>
            </div>
          </div>

          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path d="M7 4h10a2 2 0 012 2v13l-7-3-7 3V6a2 2 0 012-2z" />
          </svg>
        </div>

        {/* Tags section */}
        <div className="flex flex-wrap gap-1 mb-5">
          <span className="px-4 py-2 rounded-full bg-white/10 text-white/90 text-sm border border-white/15 shadow-inner backdrop-blur-sm">
            Liquidity <span className="font-semibold">{liquidity}</span>
          </span>
          <span className="px-4 py-2 rounded-full bg-white/10 text-white/90 text-sm border border-white/15 shadow-inner backdrop-blur-sm">
            Yield{" "}
            <span className="text-green-400 font-semibold">{yieldValue}</span>
          </span>
          <span className="px-4 py-2 rounded-full bg-white/10 text-white/90 text-sm border border-white/15 shadow-inner backdrop-blur-sm">
            {timeAgo}
          </span>
        </div>

        {/* Action buttons section */}
        <div className="flex items-center">
          <div className="relative flex-1 mr-3">
            <span className="pointer-events-none absolute -inset-x-6 -inset-y-2 rounded-[28px] bg-[radial-gradient(60%_120%_at_50%_100%,rgba(59,130,246,.55),transparent)] blur-2xl opacity-80" />
            <Button
              variant="gradient-blue"
              onClick={onViewVault}
              className="w-full"
            >
              View vault
            </Button>
          </div>

          <button
            aria-label="Share"
            className="h-12 w-12 rounded-full bg-white/5 border border-white/15 backdrop-blur-sm flex items-center justify-center hover:bg-white/10 transition"
            onClick={onShare}
          >
            <Image
              src="/logos/redirect.svg"
              alt="Share"
              width={20}
              height={20}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
