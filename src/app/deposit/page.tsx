"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Deposit } from "@/components/DepositForm";
import { usePrivy, useWallets } from "@privy-io/react-auth";

export default function DepositPage() {
  const { ready, authenticated, user } = usePrivy();
  const { wallets } = useWallets();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/login");
    }
  }, [ready, authenticated, router]);

  // Show loading while Privy is initializing
  if (!ready) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Show message if not authenticated
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-50 flex items-center justify-center p-4 overflow-hidden">
      <div className="w-full max-w-md">
        {/* Wallet Info Section */}
        {user?.wallet && (
          <div className="bg-white rounded-lg p-4 mb-4 shadow-sm border">
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-2">Connected Wallet</p>
              <p className="text-sm font-mono text-gray-700 bg-gray-100 px-3 py-2 rounded-full inline-block">
                {`${user.wallet.address.slice(
                  0,
                  6
                )}...${user.wallet.address.slice(-4)}`}
              </p>
            </div>
          </div>
        )}

        <Deposit user={user} />
      </div>
    </div>
  );
}
