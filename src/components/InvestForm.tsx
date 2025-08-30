"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import { useWallets } from "@privy-io/react-auth";
import { PublicClient, HttpTransport, WalletClient } from "@nktkas/hyperliquid";

interface InvestProps {
  user?: {
    wallet?: {
      address: string;
    };
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

export function Invest({ user, isOpen, onClose }: InvestProps) {
  const [amount, setAmount] = useState("");
  const { addToast } = useToast();
  const { wallets } = useWallets();
  const [isProcessing, setIsProcessing] = useState(false);
  const [investSuccess, setInvestSuccess] = useState(false);

  // Add drawer state and refs
  const [isClosing, setIsClosing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [translateY, setTranslateY] = useState(0);
  const drawerRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const currentY = useRef(0);

  // Handle touch start
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    startY.current = e.touches[0].clientY;
    currentY.current = e.touches[0].clientY;
  };

  // Handle touch move
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;

    currentY.current = e.touches[0].clientY;
    const deltaY = currentY.current - startY.current;

    if (deltaY > 0) {
      // Only allow downward drag
      setTranslateY(deltaY);
    }
  };

  // Handle touch end
  const handleTouchEnd = () => {
    if (!isDragging) return;

    setIsDragging(false);
    const deltaY = currentY.current - startY.current;

    if (deltaY > 100) {
      // Close if dragged down more than 100px
      closeDrawer();
    } else {
      setTranslateY(0); // Reset position
    }
  };

  // Close drawer function
  const closeDrawer = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
      setTranslateY(0); // Reset position for next open
    }, 300); // Match the transition duration
  };

  // If drawer is closed, don't render
  if (!isOpen) {
    return null;
  }

  const handleKeypadInput = (value: string) => {
    if (value === "backspace") {
      setAmount((prev) => prev.slice(0, -1));
    } else {
      // Only allow numbers and decimal point
      if (/^[0-9.]$/.test(value)) {
        // Prevent multiple decimal points
        if (value === "." && amount.includes(".")) return;

        // Limit to 2 decimal places
        const newAmount = amount + value;
        const decimalIndex = newAmount.indexOf(".");
        if (decimalIndex !== -1 && newAmount.length - decimalIndex > 3) return;

        setAmount(newAmount);
      }
    }
  };

  const formatDisplayAmount = (value: string) => {
    if (!value) return "0";
    const num = parseFloat(value);
    if (isNaN(num)) return "0";
    return num.toFixed(2);
  };

  const investInVault = async (vaultAddress: string, amount: string) => {
    if (!user?.wallet?.address) {
      addToast({
        type: "error",
        message: "No wallet connected",
        duration: 3000,
      });
      return;
    }

    const walletAddress = user.wallet.address;
    const wallet = wallets.find((w) => w.address === walletAddress);
    if (!wallet) {
      addToast({
        type: "error",
        message: "Wallet not found",
        duration: 3000,
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Get the Ethereum provider from Privy's wallet
      const provider = await wallet.getEthereumProvider();

      // Create a wallet adapter that's compatible with Hyperliquid SDK
      const walletAdapter = {
        address: walletAddress as `0x${string}`,
        signMessage: async (message: string) => {
          const signature = await provider.request({
            method: "personal_sign",
            params: [message, walletAddress],
          });
          return signature as string;
        },
        signTypedData: async (typedData: Record<string, unknown>) => {
          const signature = await provider.request({
            method: "eth_signTypedData_v4",
            params: [walletAddress, JSON.stringify(typedData)],
          });
          return signature as string;
        },
      };

      // Create transport for testnet
      const transport = new HttpTransport({
        url: "https://api.hyperliquid-testnet.xyz/exchange",
      });

      // Create WalletClient with Privy wallet
      const walletClient = new WalletClient({
        transport,
        wallet: walletAdapter,
        isTestnet: true, // Important: Set to true for testnet
      });

      console.log(
        `Attempting to invest ${amount} USD in vault ${vaultAddress}`
      );

      // Use the proper vaultTransfer method from Hyperliquid SDK
      const investmentResponse = await walletClient.vaultTransfer({
        vaultAddress: vaultAddress as `0x${string}`,
        isDeposit: true,
        usd: parseFloat(amount) * 1e6, // Convert to micro-USD (1 USD = 1e6 micro-USD)
      });

      console.log("Investment response:", investmentResponse);

      if (investmentResponse && investmentResponse.status === "ok") {
        setIsProcessing(false);
        setInvestSuccess(true);

        addToast({
          type: "success",
          message: `Successfully invested $${parseFloat(amount).toFixed(
            2
          )} in vault! Transaction signed and sent to Hyperliquid testnet.`,
          duration: 4000,
        });

        // Reset amount
        setAmount("");

        // Auto close after success
        setTimeout(() => {
          setInvestSuccess(false);
          closeDrawer();
          // Refresh the page to show updated balance
          window.location.reload();
        }, 2000);
      } else {
        throw new Error(
          typeof investmentResponse?.response === "string"
            ? investmentResponse.response
            : "Transaction failed"
        );
      }
    } catch (error) {
      console.error("Investment error:", error);
      setIsProcessing(false);
      addToast({
        type: "error",
        message: `Investment failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        duration: 5000,
      });
    }
  };

  const handleInvest = async () => {
    if (!amount || parseFloat(amount) <= 0) return;

    // Use the testnet vault address
    const vaultAddress = "0xfe63937e71b9ea1fb474eaf767664840188b7754";
    await investInVault(vaultAddress, amount);
  };

  return (
    <div
      className={`fixed inset-0 bg-black/50 flex items-end justify-center z-50 p-4 transition-opacity duration-300 ${
        isClosing ? "opacity-0" : "opacity-100"
      }`}
    >
      <div
        ref={drawerRef}
        className="bg-white rounded-t-3xl w-full max-w-sm mx-auto overflow-hidden transform transition-all duration-300 ease-out min-h-[85vh]"
        style={{
          transform: `translateY(${isClosing ? "100%" : translateY}px)`,
          transition: isDragging ? "none" : "all 0.3s ease-out",
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing">
          <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
        </div>

        <div className="px-6 py-6">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={closeDrawer}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <h2 className="text-xl font-semibold text-gray-900">Invest</h2>
            <div className="w-8 h-8"></div> {/* Spacer for centering */}
          </div>

          {/* USDT Selector */}
          <div className="flex justify-center mb-6">
            <div className="bg-black rounded-full px-4 py-2 flex items-center gap-2">
              <div className="w-4 h-4 bg-teal-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">$</span>
              </div>
              <span className="text-white text-sm font-medium">$USDT</span>
              <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-black rounded-full" />
              </div>
            </div>
          </div>

          <div className="text-center mb-6">
            <p className="text-gray-500 text-sm mb-2">Amount</p>
            <div className="text-6xl font-light text-gray-300">
              ${formatDisplayAmount(amount)}
            </div>

            {/* Preset amount buttons */}
            <div className="flex justify-center gap-3 mt-6">
              <button
                onClick={() => setAmount("10")}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-full text-sm font-medium transition-colors"
              >
                $10
              </button>
              <button
                onClick={() => setAmount("50")}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-full text-sm font-medium transition-colors"
              >
                $50
              </button>
              <button
                onClick={() => setAmount("100")}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-full text-sm font-medium transition-colors"
              >
                $100
              </button>
              <button
                onClick={() => setAmount("500")}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-full text-sm font-medium transition-colors"
              >
                $500
              </button>
            </div>
          </div>

          <Button
            onClick={handleInvest}
            className="w-full bg-gray-400 hover:bg-gray-500 text-white font-medium py-4 rounded-full text-lg mb-6"
            disabled={!amount || parseFloat(amount) <= 0 || isProcessing}
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Investing...
              </div>
            ) : investSuccess ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
                Success!
              </div>
            ) : (
              "Invest"
            )}
          </Button>
        </div>

        {/* Keypad */}
        <div
          className={`bg-gray-50 p-6 ${
            isProcessing ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          <div className="grid grid-cols-3 gap-4">
            <KeypadButton
              value="1"
              onClick={handleKeypadInput}
              disabled={isProcessing}
            />
            <KeypadButton
              value="2"
              onClick={handleKeypadInput}
              disabled={isProcessing}
            />
            <KeypadButton
              value="3"
              onClick={handleKeypadInput}
              disabled={isProcessing}
            />
            <KeypadButton
              value="4"
              onClick={handleKeypadInput}
              disabled={isProcessing}
            />
            <KeypadButton
              value="5"
              onClick={handleKeypadInput}
              disabled={isProcessing}
            />
            <KeypadButton
              value="6"
              onClick={handleKeypadInput}
              disabled={isProcessing}
            />
            <KeypadButton
              value="7"
              onClick={handleKeypadInput}
              disabled={isProcessing}
            />
            <KeypadButton
              value="8"
              onClick={handleKeypadInput}
              disabled={isProcessing}
            />
            <KeypadButton
              value="9"
              onClick={handleKeypadInput}
              disabled={isProcessing}
            />
            <div />
            <KeypadButton
              value="0"
              onClick={handleKeypadInput}
              disabled={isProcessing}
            />
            <button
              onClick={() => handleKeypadInput("backspace")}
              className="h-16 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isProcessing}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface KeypadButtonProps {
  value: string;
  onClick: (value: string) => void;
  disabled?: boolean;
}

function KeypadButton({ value, onClick, disabled }: KeypadButtonProps) {
  return (
    <button
      onClick={() => !disabled && onClick(value)}
      className={`h-16 flex flex-col items-center justify-center text-gray-900 rounded-lg transition-colors ${
        disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200"
      }`}
      disabled={disabled}
    >
      <span className="text-2xl font-light">{value}</span>
    </button>
  );
}
