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
import { TotalBalance } from "@/components/ui/totalBalance";

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

      <TotalBalance topTrades={topTrades} trendingVaults={trendingVaults} />
    </div>
  );
}
