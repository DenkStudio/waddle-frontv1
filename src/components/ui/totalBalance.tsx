"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "./button";
import VaultCard from "./VaultCard";
import { usePrivy } from "@privy-io/react-auth";
import { useToast } from "./toast";
import { useState, useEffect } from "react";
import { PublicClient, HttpTransport } from "@nktkas/hyperliquid";

interface TrendingVault {
  name: string;
  src: string;
  apr: string;
}

export interface TopTrade {
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
  balance,
  showTrendingVaults = true,
  trendingVaults = [],
  topTrades = [],
}: TotalBalanceProps) {
  const router = useRouter();
  const { user } = usePrivy();
  const { addToast } = useToast();

  const [usdcBalance, setUsdcBalance] = useState<string>("...");
  const [balanceLoading, setBalanceLoading] = useState<boolean>(false);
  const [balanceError, setBalanceError] = useState<string | null>(null);

  const fetchUsdcBalance = async (walletAddress: string) => {
    setBalanceLoading(true);
    setBalanceError(null);

    try {
      const transport = new HttpTransport({
        url: "https://api.hyperliquid-testnet.xyz/info", // Using testnet
      });
      const client = new PublicClient({ transport });

      // Fetch clearinghouse state to get account balances
      const clearinghouseState = await client.clearinghouseState({
        user: walletAddress as `0x${string}`,
      });

      if (clearinghouseState && clearinghouseState.marginSummary) {
        // The accountValue represents the total account value in USDC
        const accountValue = parseFloat(
          clearinghouseState.marginSummary.accountValue
        );
        setUsdcBalance(accountValue.toFixed(2));
      } else {
        setUsdcBalance("...");
      }
    } catch (error) {
      console.error("Error fetching USDC balance:", error);
      setBalanceError("Failed to fetch balance");
      setUsdcBalance("...");
    } finally {
      setBalanceLoading(false);
    }
  };

  // Fetch balance when user wallet is available
  useEffect(() => {
    if (user?.wallet?.address) {
      fetchUsdcBalance(user.wallet.address);
    } else {
      setUsdcBalance("...");
      setBalanceError(null);
    }
  }, [user?.wallet?.address]);

  const handleCopyAddress = () => {
    if (user?.wallet?.address) {
      navigator.clipboard.writeText(user.wallet.address);
      addToast({
        type: "success",
        message: "Address copied to clipboard!",
        duration: 3000,
      });
    }
  };

  // Use fetched balance if available, otherwise fall back to prop or default
  const displayBalance = balance || usdcBalance;

  return (
    <div className="px-6 space-y-6">
      <div className="space-y-1">
        <p className="text-gray-500 text-base font-medium">Total balance</p>
        <div className="flex items-center justify-between">
          <div className="flex items-baseline">
            <span className="text-2xl font-bold text-gray-900">$</span>
            <span className="text-4xl font-bold text-gray-900">
              {balanceLoading ? "..." : displayBalance}
            </span>
            {balanceError && (
              <span className="text-sm text-red-500 ml-2">
                Error loading balance
              </span>
            )}
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

        {/* Wallet Address */}
        {user?.wallet?.address && (
          <div className="flex items-center gap-2">
            <span className="text-black opacity-60 font-mono text-sm">
              {`${user.wallet.address.slice(
                0,
                6
              )}...${user.wallet.address.slice(-6)}`}
            </span>
            <button
              onClick={handleCopyAddress}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <svg
                className="w-4 h-4 text-black opacity-60 hover:opacity-60"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </button>
          </div>
        )}
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

      {showTrendingVaults && trendingVaults.length > 0 && (
        <div className="w-full h-px bg-gray-200"></div>
      )}

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

        <div className="space-y-4">
          {topTrades.map((trade) => (
            <VaultCard
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
    </div>
  );
}
