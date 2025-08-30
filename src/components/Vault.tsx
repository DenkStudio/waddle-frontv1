"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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

interface VaultsProps {
  vaultAddress?: string;
}

export default function Vaults({ vaultAddress }: VaultsProps) {
  const { user } = usePrivy();
  const router = useRouter();
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

  const [userVaultPosition, setUserVaultPosition] = useState<{
    loading: boolean;
    data: {
      vaultEquity: string;
      pnl: string;
      allTimePnl: string;
      daysFollowing: number;
    } | null;
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

  const fetchUserVaultPosition = async (
    userAddress: string,
    vaultAddress: string
  ) => {
    setUserVaultPosition({ loading: true, data: null, error: null });

    try {
      const transport = new HttpTransport({
        url: "https://api.hyperliquid-testnet.xyz/info", // Using testnet
      });
      const client = new PublicClient({ transport });

      // Fetch vault details to get follower information
      const vaultDetails = await client.vaultDetails({
        vaultAddress: vaultAddress as `0x${string}`,
      });

      if (!vaultDetails) {
        setUserVaultPosition({
          loading: false,
          data: null,
          error: "Vault not found",
        });
        return;
      }

      // Find the user's position in the followers array
      const userPosition = vaultDetails.followers.find(
        (follower) => follower.user.toLowerCase() === userAddress.toLowerCase()
      );

      if (userPosition) {
        setUserVaultPosition({
          loading: false,
          data: {
            vaultEquity: userPosition.vaultEquity,
            pnl: userPosition.pnl,
            allTimePnl: userPosition.allTimePnl,
            daysFollowing: userPosition.daysFollowing,
          },
          error: null,
        });
      } else {
        setUserVaultPosition({
          loading: false,
          data: null,
          error: "No position found in this vault",
        });
      }
    } catch (error) {
      setUserVaultPosition({
        loading: false,
        data: null,
        error: `Error fetching vault position: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      });
    }
  };

  // Fetch vault details and positions on component mount
  useEffect(() => {
    const targetVaultAddress =
      vaultAddress || "0xfe63937e71b9ea1fb474eaf767664840188b7754";
    fetchVaultDetails(targetVaultAddress);
    fetchVaultPositions(targetVaultAddress);
  }, [vaultAddress]);

  // Fetch user's vault position when authenticated
  useEffect(() => {
    if (user?.wallet?.address) {
      const targetVaultAddress =
        vaultAddress || "0xfe63937e71b9ea1fb474eaf767664840188b7754";
      fetchUserVaultPosition(user.wallet.address, targetVaultAddress);
    } else {
      setUserVaultPosition({ loading: false, data: null, error: null });
    }
  }, [user?.wallet?.address, vaultAddress]);

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
          <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        }
        centerComponent={
          <div className="text-center">
            <p className="text-sm text-gray-500 font-medium">View vault</p>
          </div>
        }
        rightComponent={
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              />
            </svg>
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto pb-52">
        <div className="bg-white rounded-2xl mb-3">
          {/* Profile Picture */}
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
              <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center">
                <div className="w-8 h-6 bg-gray-300 rounded-full transform rotate-45"></div>
              </div>
            </div>
          </div>

          {/* Name and Handle */}
          <div className="text-center mb-3">
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
              <span className="text-green-500 font-medium">
                +{vaultDetails.data?.apr?.toFixed(1) || "0"}%
              </span>
            </span>
            <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
              {vaultDetails.data?.followers?.length || 0} followers
            </span>
          </div>

          <div className="w-full h-px bg-gray-200 my-4"></div>

          {/* User's Vault Position - Only show if user has a position */}
          {user?.wallet?.address && userVaultPosition.data && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Your Position
              </h3>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span>✅</span>
                    <span className="text-sm font-medium text-green-800">
                      You&apos;re following this vault
                    </span>
                  </div>
                  <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                    {userVaultPosition.data.daysFollowing} days
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Your Equity</p>
                    <p className="text-lg font-semibold text-gray-900">
                      $
                      {Number(
                        userVaultPosition.data.vaultEquity
                      ).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Current P&L</p>
                    <p
                      className={`text-lg font-semibold ${
                        Number(userVaultPosition.data.pnl) >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {Number(userVaultPosition.data.pnl) >= 0 ? "+" : ""}$
                      {Number(userVaultPosition.data.pnl).toLocaleString(
                        undefined,
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">All-Time P&L</p>
                    <p
                      className={`text-lg font-semibold ${
                        Number(userVaultPosition.data.allTimePnl) >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {Number(userVaultPosition.data.allTimePnl) >= 0
                        ? "+"
                        : ""}
                      $
                      {Number(userVaultPosition.data.allTimePnl).toLocaleString(
                        undefined,
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="w-full h-px bg-gray-200 my-4"></div>
            </div>
          )}

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
          <div className="space-y-4 -mx-4 px-4">
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

          <div className="relative">
            <button
              onClick={() => {
                const targetVaultAddress =
                  vaultAddress || "0xfe63937e71b9ea1fb474eaf767664840188b7754";
                router.push(`/chat/${targetVaultAddress}`);
              }}
              className="w-16 h-16 bg-black rounded-full flex items-center justify-center shadow-lg hover:bg-gray-800 transition-colors"
            >
              <Image src="/logos/chat.svg" alt="chat" width={24} height={24} />
            </button>

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
