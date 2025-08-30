"use client";

import { useState, useEffect } from "react";

import { Header } from "@/components/Header";
import { ProfileAvatar } from "@/components/icons/ProfileAvatar";
import { SearchIcon } from "@/components/icons/SearchIcon";
import { TradeCard } from "./TradeCard";
import Image from "next/image";
import { PublicClient, HttpTransport } from "@nktkas/hyperliquid";
import { Invest } from "./InvestForm";
import { usePrivy } from "@privy-io/react-auth";
import { SettingsMenu } from "@/components/SettingsMenu";

interface VaultFollower {
  user: string;
  vaultEquity: string;
  pnl: string;
  allTimePnl: string;
  daysFollowing: number;
  vaultEntryTime: number;
  lockupUntil: number;
}

interface VaultData {
  name: string;
  vaultAddress: string;
  leader: string;
  description: string;
  apr: number;
  leaderCommission: number;
  maxDistributable: number;
  maxWithdrawable: number;
  isClosed: boolean;
  allowDeposits: boolean;
  followers: VaultFollower[];
}

interface AssetPosition {
  position: {
    coin: string;
    szi: string;
    entryPx?: string;
    positionValue: string;
    unrealizedPnl: string;
  };
  leverage?: {
    value: string;
  };
}

export default function Vaults() {
  const { user } = usePrivy();
  const [isInvestOpen, setIsInvestOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [vaultDetails, setVaultDetails] = useState<{
    loading: boolean;
    data: VaultData | null;
    error: string | null;
  }>({
    loading: false,
    data: null,
    error: null,
  });

  const [vaultPositions, setVaultPositions] = useState<{
    loading: boolean;
    data: AssetPosition[] | null;
    error: string | null;
  }>({
    loading: false,
    data: null,
    error: null,
  });

  const fetchVaultDetails = async (vaultAddress: string) => {
    setVaultDetails({ loading: true, data: null, error: null });

    try {
      const transport = new HttpTransport({
        url: "https://api.hyperliquid-testnet.xyz/info", // Using testnet for vault data
      });
      const client = new PublicClient({ transport });

      // Fetch vault details
      const details = await client.vaultDetails({
        vaultAddress: vaultAddress as `0x${string}`,
      });

      if (details) {
        setVaultDetails({
          loading: false,
          data: details,
          error: null,
        });
      } else {
        setVaultDetails({
          loading: false,
          data: null,
          error: "Vault not found",
        });
      }
    } catch (error) {
      setVaultDetails({
        loading: false,
        data: null,
        error: `Error fetching vault details: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      });
    }
  };

  const fetchVaultPositions = async (vaultAddress: string) => {
    setVaultPositions({ loading: true, data: null, error: null });

    try {
      const transport = new HttpTransport({
        url: "https://api.hyperliquid-testnet.xyz/info", // Using testnet
      });
      const client = new PublicClient({ transport });

      // Fetch vault's clearinghouse state to get open positions
      const clearinghouseState = await client.clearinghouseState({
        user: vaultAddress as `0x${string}`,
      });

      if (clearinghouseState && clearinghouseState.assetPositions) {
        // Filter out positions with zero size
        const openPositions = clearinghouseState.assetPositions.filter(
          (position) => parseFloat(position.position.szi) !== 0
        );

        setVaultPositions({
          loading: false,
          data: openPositions,
          error: null,
        });
      } else {
        setVaultPositions({
          loading: false,
          data: [],
          error: null,
        });
      }
    } catch (error) {
      setVaultPositions({
        loading: false,
        data: null,
        error: `Error fetching vault positions: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      });
    }
  };

  // Fetch vault details and positions on component mount
  useEffect(() => {
    const testnetVaultAddress = "0xfe63937e71b9ea1fb474eaf767664840188b7754";
    fetchVaultDetails(testnetVaultAddress);
    fetchVaultPositions(testnetVaultAddress);
  }, []);

  if (vaultDetails.loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="h-full bg-white overflow-hidden flex flex-col px-4">
      {/* Header */}
      <Header
        leftComponent={
          <ProfileAvatar size={56} onClick={() => setIsSettingsOpen(true)} />
        }
        centerComponent={
          <h1 className="text-xl font-semibold text-gray-900">view vault</h1>
        }
        rightComponent={<SearchIcon size={56} />}
        className="pt-12 pb-6"
      />

      <div className="flex-1 overflow-y-auto">
        <div className="bg-white rounded-2xl mb-6">
          {/* Profile Picture */}
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
              <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center">
                <div className="w-8 h-6 bg-gray-300 rounded-full transform rotate-45"></div>
              </div>
            </div>
          </div>

          {/* Name and Handle */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {vaultDetails.data?.name || "Loading..."}
            </h2>
            <p className="text-blue-600 text-lg">
              {vaultDetails.data?.leader
                ? `${vaultDetails.data.leader.slice(0, 8)}...`
                : "Loading..."}
            </p>
          </div>

          {/* Error State */}
          {vaultDetails.error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-700 text-sm">{vaultDetails.error}</p>
            </div>
          )}

          {/* Stats Labels */}
          <div className="flex flex-wrap gap-3 justify-center mb-6">
            <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
              TVL $
              {vaultDetails.data?.maxDistributable
                ? (vaultDetails.data.maxDistributable / 1000000).toFixed(1)
                : "0"}
              m
            </span>
            <span className="px-4 py-2 bg-gray-900 text-white rounded-full text-sm font-medium">
              APR{" "}
              <span className="text-green-500">
                +{vaultDetails.data?.apr?.toFixed(1) || "0"}%
              </span>
            </span>
            <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
              {vaultDetails.data?.followers?.length || 0} followers
            </span>
          </div>

          <div className="w-full h-px bg-gray-200 my-4"></div>

          {/* Active Trades Section */}
          <div className="text-start mb-6">
            <p className="text-gray-700 font-medium text-xl">
              Active positions
            </p>
          </div>
        </div>

        {/* Positions Loading State */}
        {vaultPositions.loading && (
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-2 text-gray-600">Loading positions...</span>
          </div>
        )}

        {/* Positions Error State */}
        {vaultPositions.error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700 text-sm">{vaultPositions.error}</p>
          </div>
        )}

        {/* No Positions State */}
        {vaultPositions.data && vaultPositions.data.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No active positions in this vault</p>
          </div>
        )}

        {/* Real Position Cards */}
        {vaultPositions.data && vaultPositions.data.length > 0 && (
          <div className="space-y-4">
            {vaultPositions.data.map((position, index) => {
              const szi = parseFloat(position.position.szi);
              const entryPx = parseFloat(position.position.entryPx || "0");
              const positionValue = parseFloat(position.position.positionValue);
              const unrealizedPnl = parseFloat(position.position.unrealizedPnl);
              const leverage = position.leverage?.value
                ? parseFloat(position.leverage.value)
                : 0;
              const isLong = szi > 0;

              const markPx = Math.abs(positionValue) / Math.abs(szi);

              return (
                <TradeCard
                  key={`position-${index}`}
                  username={vaultDetails.data?.name || "Vault Strategy"}
                  avatar="🏛️"
                  token={position.position.coin}
                  type={isLong ? "LONG" : "SHORT"}
                  leverage={leverage > 0 ? `${leverage.toFixed(0)}x` : "Cross"}
                  profit={`${unrealizedPnl >= 0 ? "+" : ""}$${Math.abs(
                    unrealizedPnl
                  ).toLocaleString(undefined, {
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 1,
                  })}`}
                  timeAgo="Live"
                  entryPrice={entryPx.toFixed(3)}
                  markPrice={markPx.toFixed(3)}
                />
              );
            })}
          </div>
        )}

        {/* Floating Action Buttons */}
        <div className="fixed bottom-32 left-4 right-4 flex items-center gap-4 z-50">
          {/* Large Green Invest Button */}
          <button
            onClick={() => setIsInvestOpen(true)}
            className="flex-1 bg-green-500 text-white font-semibold py-4 px-6 rounded-full text-lg shadow-lg hover:bg-green-600 transition-colors"
          >
            Invest
          </button>

          {/* Circular Black Chat Icon with Notification Badge */}
          <div className="relative">
            <button className="w-16 h-16 bg-black rounded-full flex items-center justify-center shadow-lg hover:bg-gray-800 transition-colors">
              {/* Chat Icon */}
              <Image src="/logos/chat.svg" alt="chat" width={24} height={24} />
            </button>

            {/* Notification Badge */}
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">10</span>
            </div>
          </div>
        </div>

        {/* Invest Modal */}
        <Invest
          user={user}
          isOpen={isInvestOpen}
          onClose={() => setIsInvestOpen(false)}
        />

        {/* Settings Menu */}
        <SettingsMenu
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
        />
      </div>
    </div>
  );
}
