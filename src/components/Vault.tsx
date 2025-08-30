"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { ProfileAvatar } from "@/components/icons/ProfileAvatar";
import { SearchIcon } from "@/components/icons/SearchIcon";
import { Trade } from "@/types";
import TradeCard from "./ui/TradeCard";
import { topTrades } from "@/lib/constants";

// Insiders Club Card Component
const InsidersClubCard = () => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mx-4 mb-6">
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
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Insiders Club</h2>
        <p className="text-blue-600 text-lg">@cryptowhale.eth</p>
      </div>

      {/* Stats Labels */}
      <div className="flex flex-wrap gap-3 justify-center mb-6">
        <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
          TVL $596m
        </span>
        <span className="px-4 py-2 bg-gray-900 text-white rounded-full text-sm font-medium">
          APR +12.5%
        </span>
        <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
          4mo ago
        </span>
      </div>

      {/* Active Trades Section */}
      <div className="text-center">
        <p className="text-gray-700 font-medium">Active trades</p>
      </div>
    </div>
  );
};

export default function Vaults() {
  const [isLoading] = useState(false);
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
    <div className="min-h-screen bg-white pb-20 px-4">
      {/* Header */}
      <Header
        leftComponent={<ProfileAvatar size={56} />}
        centerComponent={
          <h1 className="text-xl font-semibold text-gray-900">view vault</h1>
        }
        rightComponent={<SearchIcon size={56} />}
        className="pt-12 pb-6"
      />

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
            APR +12.5%
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
  );
}
