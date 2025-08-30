"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { ProfileAvatar } from "@/components/icons/ProfileAvatar";
import { SearchIcon } from "@/components/icons/SearchIcon";
import { Trade } from "@/types";
import TradeCard from "./ui/TradeCard";
import { topTrades } from "@/lib/constants";
import { SettingsMenu } from "@/components/SettingsMenu";
import Image from "next/image";

export default function Vaults() {
  const [isLoading] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const router = useRouter();

  // Mock data for top trades

  if (isLoading) {
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
            Insiders Club
          </h2>
          <p className="text-blue-600 text-lg">@cryptowhale.eth</p>
        </div>

        {/* Stats Labels */}
        <div className="flex flex-wrap gap-3 justify-center mb-6">
          <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
            TVL $596m
          </span>
          <span className="px-4 py-2 bg-gray-900 text-white rounded-full text-sm font-medium">
            APR <span className="text-green-500">+12.5%</span>
          </span>
          <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
            4mo ago
          </span>
        </div>

        <div className="w-full h-px bg-gray-200 my-4"></div>

        {/* Active Trades Section */}
        <div className="text-start mb-6">
          <p className="text-gray-700 font-medium text-xl">Active trades</p>
        </div>
      </div>

      {/* Trade Cards */}
      <div className="space-y-4">
        {topTrades.map((trade) => (
          <TradeCard key={trade.id} trade={trade} />
        ))}
        </div>
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-32 left-4 right-4 flex items-center gap-4 z-50">
        {/* Large Green Invest Button */}
        <button className="flex-1 bg-green-500 text-white font-semibold py-4 px-6 rounded-full text-lg shadow-lg hover:bg-green-600 transition-colors">
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

      {/* Settings Menu */}
      <SettingsMenu
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}
