"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { ProfileAvatar } from "@/components/icons/ProfileAvatar";
import { SearchIcon } from "@/components/icons/SearchIcon";
import { trendingVaults } from "@/lib/constants";
import { TotalBalance } from "@/components/ui/totalBalance";
import { usePrivy } from "@privy-io/react-auth";
import { SettingsMenu } from "@/components/SettingsMenu";

export default function Home() {
  const { ready, authenticated } = usePrivy();
  const [isLoading] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/login");
    }
  }, [ready, authenticated, router]);

  // Mock data for top trades (fixed to match TopTrade interface)
  const topTrades = [
    {
      id: "1",
      title: "SOL Long Position",
      username: "@cryptowhale",
      earnings: "+$4,300",
      invested: "$1,200",
      since: "3min ago",
    },
    {
      id: "2",
      title: "ETH Short Play",
      username: "@defi_master",
      earnings: "+$2,850",
      invested: "$800",
      since: "15min ago",
    },
  ];

  // Show loading while Privy is initializing
  if (!ready) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Show loading while checking authentication
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
        leftComponent={
          <ProfileAvatar size={56} onClick={() => setIsSettingsOpen(true)} />
        }
        centerComponent={
          <h1 className="text-xl font-semibold text-gray-900">Explore</h1>
        }
        rightComponent={<SearchIcon size={56} />}
        className="pt-12 pb-6"
      />

      <TotalBalance topTrades={topTrades} trendingVaults={trendingVaults} />

      {/* Settings Menu */}
      <SettingsMenu
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}
