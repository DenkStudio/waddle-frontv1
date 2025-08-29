"use client";

import React, { useState } from "react";
import { DepositModal } from "@/components/DepositForm";
import { Button } from "@/components/ui/button";

export default function DepositPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Deposit Demo</h1>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-full text-lg"
        >
          Open Deposit Modal
        </Button>

        <DepositModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </div>
  );
}
