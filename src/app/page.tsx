"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { ProfileAvatar } from "@/components/icons/ProfileAvatar";
import { SearchIcon } from "@/components/icons/SearchIcon";
import { Trade } from "@/types";
import { trendingVaults } from "@/lib/constants";
import Image from "next/image";
import InsidersClubCard from "@/components/InsidersClubCard";

export default function Home() {
  const [isLoading] = useState(false);
  const router = useRouter();

  // Mock data for top trades
  const topTrades: Trade[] = [
    {
      id: "1",
      username: "@cryptowhale",
      avatar: "🐋",
      token: "$SOL",
      type: "LONG",
      leverage: "10x",
      profit: "+$4,300",
      timeAgo: "3min ago",
    },
  ];

  // useEffect(() => {
  //   // Check if user is logged in
  //   const userData = localStorage.getItem("waddle_user");
  //   if (!userData) {
  //     router.push("/login");
  //     return;
  //   }

  //   const parsedUser = JSON.parse(userData);
  //   setUser(parsedUser);
  //   setIsLoading(false);
  // }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <Header
        leftComponent={<ProfileAvatar size={56} />}
        centerComponent={
          <h1 className="text-xl font-semibold text-gray-900">Explore</h1>
        }
        rightComponent={<SearchIcon size={56} />}
        className="pt-12 pb-6"
      />

      <div className="px-6 space-y-6">
        {/* Total Balance Section */}
        <div className="space-y-3">
          <p className="text-gray-500 text-base font-medium">Total balance</p>
          <div className="flex items-center justify-between">
            <div className="flex items-baseline">
              <span className="text-2xl font-bold text-gray-900">$</span>
              <span className="text-4xl font-bold text-gray-900">102.35</span>
            </div>
            <button
              onClick={() => router.push("/deposit")}
              className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 border-0 shadow-none flex items-center justify-center transition-all duration-200 active:scale-95"
              style={{
                WebkitTapHighlightColor: "transparent",
                outline: "none",
                border: "none",
              }}
            >
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Separator Line */}
        <div className="w-full h-px bg-gray-200"></div>

        {/* Trending Section */}
        <div className="space-y-5">
          <h2 className="text-xl font-semibold text-gray-900">
            Trending vaults
          </h2>
          <div className="flex space-x-6 overflow-x-auto pb-2 scrollbar-hide">
            {trendingVaults.map((vault) => (
              <div key={vault.name} className="flex-shrink-0 w-20 text-center">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-2xl mb-2 mx-auto ">
                  <Image
                    width={64}
                    height={64}
                    src={vault.src}
                    alt={vault.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <p className="text-sm font-medium text-gray-900">
                  {vault.name}
                </p>
                <p className="text-xs text-gray-500 mt-1 bg-gray-100 rounded-full px-2 py-1">
                  APR <span className="text-green-500">{vault.apr}</span>
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full h-px bg-gray-200"></div>

        {/* Top Trades Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Holdings</h2>
            <Button
              size="sm"
              className="text-blue-500 border border-blue-500 bg-transparent hover:bg-blue-50"
            >
              View all →
            </Button>
          </div>

          {topTrades.map((trade) => (
            <InsidersClubCard
              variant="light"
              title="BeInCrypto"
              username="@beinctrpyo_official"
              earnings="+$108.9"
              invested="4203.48"
              since="3mo ago"
              onViewVault={() => {}}
              onShare={() => {}}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
