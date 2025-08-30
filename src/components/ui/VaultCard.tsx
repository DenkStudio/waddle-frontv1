"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "./button";
import { useRouter } from "next/navigation";
import StoryView from "../StoryView";
import { sampleVideos } from "@/lib/sampleVideos";

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
  vaultAddress?: string;
  onViewVault?: () => void;
  onShare?: () => void;
  className?: string;
}

export default function VaultCard({
  title = "Insiders Club",
  username = "cryptowhale",
  liquidity = "+$52m",
  yield: yieldValue = "+12.5%",
  timeAgo = "91 days ago",
  earnings = "+$108.9",
  invested = "$4203.48",
  since = "3mo ago",
  variant = "dark",
  vaultAddress,
  onViewVault,
  onShare,
  className = "",
}: VaultCardProps) {
  const router = useRouter();
  const [isStoryOpen, setIsStoryOpen] = useState(false);

  const handleViewVault = () => {
    if (vaultAddress) {
      router.push(`/vault/${vaultAddress}`);
    } else {
      router.push("/vault/0xfe63937e71b9ea1fb474eaf767664840188b7754");
    }
    if (onViewVault) {
      onViewVault();
    }
  };

  const handleChat = () => {
    const chatVaultId =
      vaultAddress || "0xfe63937e71b9ea1fb474eaf767664840188b7754";
    router.push(`/chat/${chatVaultId}`);
    if (onShare) {
      onShare();
    }
  };
  if (variant === "light") {
    return (
      <div
        className={`relative rounded-[40px] bg-gray-100  overflow-hidden ${className}`}
      >
        <div className="relative py-4 px-6">
          {/* Header section */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div
                className="relative cursor-pointer"
                onClick={() => setIsStoryOpen(true)}
              >
                {/* Instagram story ring with breathing animation */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-400 p-1 animate-pulse">
                  <div className="h-full w-full rounded-full bg-gray-100"></div>
                </div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-400 animate-ping opacity-20"></div>
                <div className="relative h-12 w-12 rounded-full bg-white flex items-center justify-center m-1 hover:scale-105 transition-transform">
                  <span className="text-black font-bold text-2xl">🙏</span>
                </div>
              </div>
              <div>
                <h3 className="text-black font-bold text-xl leading-6">
                  {title}
                </h3>
                <p className="text-blue-600 text-sm">{username}</p>
              </div>
            </div>
          </div>

          {/* Statistics section */}
          <div className="flex gap-3 mb-4">
            <div className="flex-1 text-center p-1 rounded-2xl bg-white ">
              <div className="text-green-600 font-medium text-lg">
                {earnings}
              </div>
              <div className="text-gray-500 text-sm">Earnings</div>
            </div>
            <div className="flex-1 text-center p-1 rounded-2xl bg-white ">
              <div className="text-black font-medium text-lg">{invested}</div>
              <div className="text-gray-500 text-sm">Invested</div>
            </div>
            <div className="flex-1 text-center p-1 rounded-2xl bg-white ">
              <div className="text-black font-medium text-lg">{since}</div>
              <div className="text-gray-500 text-sm">Since</div>
            </div>
          </div>

          {/* Action buttons section */}
          <div className="flex items-center gap-3">
            <Button
              variant="gradient-blue"
              onClick={handleViewVault}
              className="flex-1 h-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold"
            >
              View vault
            </Button>

            <button
              aria-label="Chat"
              className="h-12 w-12 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800 transition"
              onClick={handleChat}
            >
              <Image src="/logos/chat.svg" alt="Share" width={20} height={20} />
            </button>
          </div>
        </div>

        {/* Story View Modal */}
        <StoryView
          videos={sampleVideos}
          isOpen={isStoryOpen}
          onClose={() => setIsStoryOpen(false)}
          userName={title}
          userHandle={username}
        />
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
            <div
              className="relative cursor-pointer"
              onClick={() => setIsStoryOpen(true)}
            >
              {/* Instagram story ring with breathing animation */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-400 p-0.5 animate-pulse">
                <div className="h-full w-full rounded-full bg-black"></div>
              </div>
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-400 animate-ping opacity-20"></div>
              <div className="relative h-10 w-10 rounded-full bg-white flex items-center justify-center m-0.5 hover:scale-105 transition-transform">
                <svg
                  className="h-6 w-6 text-black"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2C7.03 2 3 6.03 3 11s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 3.5c1.65 0 3 1.35 3 3 0 2.25-3 5-3 5s-3-2.75-3-5c0-1.65 1.35-3 3-3z" />
                </svg>
              </div>
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
            width="16"
            height="18"
            viewBox="0 0 16 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.45455 12.9881L2.45455 16.8066C1.90909 17.2506 1 16.8954 1 16.0962V4.55204C1 2.59842 2.63636 1 4.63636 1H11.3636C13.3636 1 15 2.59842 15 4.55204V16.0962C15 16.8066 14.0909 17.2506 13.5455 16.8066L8.54546 12.9881C8.27273 12.8105 7.81818 12.8105 7.45455 12.9881Z"
              stroke="white"
              stroke-opacity="0.7"
              stroke-width="2"
              stroke-miterlimit="10"
              stroke-linejoin="round"
            />
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
            <span className="pointer-events-none rounded-full absolute -inset-x-6 -inset-y-2 rounded-[28px] bg-[radial-gradient(60%_120%_at_50%_100%,rgba(59,130,246,.55),transparent)] blur-2xl opacity-80" />
            <Button
              variant="gradient-blue"
              onClick={handleViewVault}
              className="w-full"
            >
              View vault
            </Button>
          </div>

          <button
            aria-label="Share"
            className="h-12 w-12 rounded-full bg-white/5 border border-white/15 backdrop-blur-sm flex items-center justify-center hover:bg-white/10 transition"
            onClick={handleChat}
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

      {/* Story View Modal */}
      <StoryView
        videos={sampleVideos}
        isOpen={isStoryOpen}
        onClose={() => setIsStoryOpen(false)}
        userName={title}
        userHandle={username}
      />
    </div>
  );
}
