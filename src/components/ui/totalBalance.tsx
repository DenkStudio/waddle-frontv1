"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "./button";
import InsidersClubCard from "../InsidersClubCard";

interface TrendingVault {
  name: string;
  src: string;
  apr: string;
}

interface TopTrade {
  id: string;
  title: string;
  username: string;
  earnings: string;
  invested: string;
  since: string;
}

interface TotalBalanceProps {
  balance?: string;
  showTrendingVaults?: boolean;
  trendingVaults?: TrendingVault[];
  topTrades?: TopTrade[];
}

export function TotalBalance({
  balance = "102.35",
  showTrendingVaults = true,
  trendingVaults = [],
  topTrades = [],
}: TotalBalanceProps) {
  const router = useRouter();

  return (
    <div className="px-6 space-y-6">
      {/* Total Balance Section */}
      <div className="space-y-3">
        <p className="text-gray-500 text-base font-medium">Total balance</p>
        <div className="flex items-center justify-between">
          <div className="flex items-baseline">
            <span className="text-2xl font-bold text-gray-900">$</span>
            <span className="text-4xl font-bold text-gray-900">{balance}</span>
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

      {/* Trending Section - Conditionally Rendered */}
      {showTrendingVaults && trendingVaults.length > 0 && (
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
      )}

      {/* Only show separator if trending vaults are shown */}
      {showTrendingVaults && trendingVaults.length > 0 && (
        <div className="w-full h-px bg-gray-200"></div>
      )}

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
            key={trade.id}
            variant="light"
            title={trade.title}
            username={trade.username}
            earnings={trade.earnings}
            invested={trade.invested}
            since={trade.since}
            onViewVault={() => {}}
            onShare={() => {}}
          />
        ))}
      </div>
    </div>
  );
}
