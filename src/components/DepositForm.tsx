"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface DepositProps {
  user?: {
    wallet?: {
      address: string;
    };
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

export function Deposit({ user, isOpen, onClose }: DepositProps) {
  const [paymentMethod, setPaymentMethod] = useState<"credit" | "wallet">(
    user?.wallet ? "wallet" : "credit"
  );
  const [amount, setAmount] = useState("");
  const { addToast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [depositSuccess, setDepositSuccess] = useState(false);

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
    if (!value) return "...";
    const num = parseFloat(value);
    if (isNaN(num)) return "...";
    return num.toFixed(2);
  };

  const handleDeposit = async () => {
    if (!amount || parseFloat(amount) <= 0) return;

    setIsProcessing(true);

    try {
      // Simulate processing delay
      await new Promise((resolve) => setTimeout(resolve, 2500));

      // Update user balance in localStorage
      const userData = localStorage.getItem("waddle_user");
      if (userData) {
        const user = JSON.parse(userData);
        user.balance += parseFloat(amount);
        localStorage.setItem("waddle_user", JSON.stringify(user));
      }

      setIsProcessing(false);
      setDepositSuccess(true);

      // Show success toast
      const methodName = paymentMethod === "credit" ? "Credit Card" : "Wallet";
      addToast({
        type: "success",
        message: `Successfully deposited $${parseFloat(amount).toFixed(
          2
        )} via ${methodName}`,
        duration: 4000,
      });

      // Reset amount to 0
      setAmount("");

      // Auto close after success
      setTimeout(() => {
        setDepositSuccess(false); // Refresh the page to show updated balance
        window.location.reload();
      }, 2000);
    } catch {
      setIsProcessing(false);
      addToast({
        type: "error",
        message: "Deposit failed. Please try again.",
        duration: 5000,
      });
    }
  };

  return (
    <div
      className={`fixed inset-0 bg-black/50 flex items-end justify-center z-50 p-4 transition-opacity duration-300 ${
        isClosing ? "opacity-0" : "opacity-100"
      }`}
    >
      <div
        ref={drawerRef}
        className="bg-white rounded-t-3xl w-full max-w-sm mx-auto overflow-hidden transform transition-all duration-300 ease-out min-h-[90vh]"
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
            <h2 className="text-xl font-semibold text-gray-900">
              Deposit Funds
            </h2>
            <div className="w-8 h-8"></div> {/* Spacer for centering */}
          </div>
        </div>
        <div className="px-6 pb-6">
          <div className="flex bg-gray-100 rounded-full p-1">
            {user?.wallet && (
              <button
                onClick={() => setPaymentMethod("wallet")}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-full text-sm font-medium transition-all",
                  paymentMethod === "wallet"
                    ? "bg-[hsl(var(--color-waddle-blue))] hover:bg-[hsl(var(--color-waddle-blue-hover))] text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                )}
              >
                Crypto Transfer
                {paymentMethod === "wallet" && (
                  <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-[hsl(var(--color-waddle-blue))] rounded-full" />
                  </div>
                )}
              </button>
            )}
            <button
              onClick={() => setPaymentMethod("credit")}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-full text-sm font-medium transition-all",
                paymentMethod === "credit"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              Credit Debit
              {paymentMethod === "credit" && (
                <div className="w-4 h-4 bg-gray-800 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
              )}
            </button>
          </div>
        </div>

        <div className="px-6 pb-8">
          {/* Wallet deposit - show address to send to */}
          {paymentMethod === "wallet" && user?.wallet ? (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Send funds to your account
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Transfer any supported cryptocurrency using the details below
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="text-center space-y-3">
                  <div className="bg-white border border-gray-200 rounded-lg p-3">
                    <p className="text-sm font-mono text-gray-900 break-all leading-relaxed">
                      {user.wallet?.address}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(user.wallet?.address || "");
                      addToast({
                        type: "success",
                        message: "Deposit details copied to clipboard!",
                        duration: 3000,
                      });
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[hsl(var(--color-waddle-blue))] hover:bg-[hsl(var(--color-waddle-blue-hover))] text-white text-sm font-medium rounded-full transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    Copy Details
                  </button>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 text-yellow-600 mt-0.5">
                    <Image
                      src="logos/warning.svg"
                      alt="warning"
                      width={48}
                      height={48}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-yellow-800">
                      Important
                    </p>
                    <p className="text-sm text-yellow-700 mt-1">
                      Only send supported cryptocurrencies to this destination.
                      Unsupported tokens may result in permanent loss.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Regular deposit flow for credit card
            <>
              <div className="text-center mb-6">
                <p className="text-gray-500 text-sm mb-2">Amount</p>
                <div
                  className={`text-6xl font-light ${
                    amount && parseFloat(amount) > 0
                      ? "text-gray-900"
                      : "text-gray-300"
                  }`}
                >
                  ${formatDisplayAmount(amount)}
                </div>

                {/* Dollar amount chips */}
                <div className="flex justify-center gap-3 mt-4">
                  <button
                    onClick={() => setAmount("10")}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-300 text-gray-900 rounded-full text-sm font-medium transition-colors"
                  >
                    $10
                  </button>
                  <button
                    onClick={() => setAmount("50")}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-300 text-gray-900 rounded-full text-sm font-medium transition-colors"
                  >
                    $50
                  </button>
                  <button
                    onClick={() => setAmount("100")}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-300 text-gray-900 rounded-full text-sm font-medium transition-colors"
                  >
                    $100
                  </button>
                  <button
                    onClick={() => setAmount("500")}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-300 text-gray-900 rounded-full text-sm font-medium transition-colors"
                  >
                    $500
                  </button>
                </div>
              </div>
            </>
          )}

          {paymentMethod !== "wallet" && (
            <Button
              onClick={handleDeposit}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-4 rounded-full text-lg"
              disabled={!amount || parseFloat(amount) <= 0 || isProcessing}
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </div>
              ) : depositSuccess ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  Success!
                </div>
              ) : (
                "Deposit"
              )}
            </Button>
          )}
        </div>

        {paymentMethod !== "wallet" && (
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
        )}
      </div>
    </div>
  );
}

interface KeypadButtonProps {
  value: string;
  label?: string;
  onClick: (value: string) => void;
  disabled?: boolean;
}

function KeypadButton({ value, label, onClick, disabled }: KeypadButtonProps) {
  return (
    <button
      onClick={() => !disabled && onClick(value)}
      className={`h-16 flex flex-col items-center justify-center text-gray-900 rounded-lg transition-colors ${
        disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200"
      }`}
      disabled={disabled}
    >
      <span className="text-2xl font-light">{value}</span>
      {label && <span className="text-xs text-gray-500 mt-1">{label}</span>}
    </button>
  );
}
