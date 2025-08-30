"use client";

import React from "react";
import Vaults from "@/components/Vault";
import { use } from "react";

interface VaultPageProps {
  params: Promise<{
    address: string;
  }>;
}

export default function VaultPage({ params }: VaultPageProps) {
  const { address } = use(params);

  return (
    <div className="h-full bg-white overflow-hidden">
      <Vaults vaultAddress={address} />
    </div>
  );
}
