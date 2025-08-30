"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { ProfileAvatar } from "@/components/icons/ProfileAvatar";
import { SearchIcon } from "@/components/icons/SearchIcon";
import { TradeCard } from "@/components/TradeCard";

interface CryptoToken {
  symbol: string;
  name: string;
  price: string;
  change?: string;
  icon: string;
}

interface Trade {
  id: string;
  username: string;
  avatar: string;
  token: string;
  type: "LONG" | "SHORT";
  leverage: string;
  profit: string;
  timeAgo: string;
}

export default function Home() {
  const [isLoading] = useState(false);
  const router = useRouter();

  // Mock data for trending tokens
  const trendingTokens: CryptoToken[] = [
    {
      symbol: "DOGE",
      name: "Dogecoin",
      price: "$2.56B",
      icon: "🐕",
      change: "+5.2%",
    },
    {
      symbol: "SHIB",
      name: "Shiba Inu",
      price: "$7.4B",
      icon: "🐺",
      change: "+2.1%",
    },
    {
      symbol: "PEPE",
      name: "Pepe",
      price: "$4.26B",
      icon: "🐸",
      change: "+8.5%",
    },
    {
      symbol: "PENGU",
      name: "Pudgy Penguins",
      price: "$1.96B",
      icon: "🐧",
      change: "-1.2%",
    },
  ];

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
          <h2 className="text-xl font-semibold text-gray-900">Trending</h2>
          <div className="flex space-x-6 overflow-x-auto pb-2 scrollbar-hide">
            {trendingTokens.map((token) => (
              <div
                key={token.symbol}
                className="flex-shrink-0 w-20 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-2xl mb-2 mx-auto">
                  {token.icon}
                </div>
                <p className="text-sm font-medium text-gray-900">
                  {token.symbol}
                </p>
                <p className="text-xs text-gray-500 mt-1">{token.price}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Top Trades Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Top trades</h2>
            <Button
              size="sm"
              className="text-blue-500 border border-blue-500 bg-transparent hover:bg-blue-50"
            >
              View all →
            </Button>
          </div>

          {topTrades.map((trade) => (
            <Card key={trade.id} className="border-0 shadow-sm bg-gray-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{trade.avatar}</div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {trade.username}
                      </p>
                      <p className="text-sm text-gray-500">{trade.timeAgo}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-green-500">
                      {trade.profit}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900">
                      {trade.token}
                    </span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                      ↗ {trade.type}
                    </span>
                    <span className="text-sm text-gray-600">
                      {trade.leverage}
                    </span>
                  </div>
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 12h14m-7-7l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>

                <Button className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white rounded-full">
                  View trade
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
