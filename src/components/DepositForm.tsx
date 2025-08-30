"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

interface DepositProps {
  user?: {
    wallet?: {
      address: string;
    };
  } | null;
}

export function Deposit({ user }: DepositProps) {
  const [paymentMethod, setPaymentMethod] = useState<"credit" | "wallet">(
    user?.wallet ? "wallet" : "credit"
  );
  const [amount, setAmount] = useState("");
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const { addToast } = useToast();

  const handleKeypadInput = (value: string) => {
    if (value === "backspace") {
      setAmount((prev) => prev.slice(0, -1));
    } else if (value === "sound") {
      setIsSoundEnabled((prev) => !prev);
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
    if (!value) return "0.00";
    const num = parseFloat(value);
    if (isNaN(num)) return "0.00";
    return num.toFixed(2);
  };

  const [isProcessing, setIsProcessing] = useState(false);
  const [depositSuccess, setDepositSuccess] = useState(false);

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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-sm mx-auto overflow-hidden">
        <div className="px-6 py-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Deposit Funds
            </h2>
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
                    ? "bg-purple-600 text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                )}
              >
                Crypto Transfer
                {paymentMethod === "wallet" && (
                  <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-purple-600 rounded-full" />
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
                    className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-full transition-colors"
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
                  <div className="w-5 h-5 text-yellow-600 mt-0.5">
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
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
                <div className="text-6xl font-light text-gray-300">
                  ${formatDisplayAmount(amount)}
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
                label="ABC"
                onClick={handleKeypadInput}
                disabled={isProcessing}
              />
              <KeypadButton
                value="2"
                label="DEF"
                onClick={handleKeypadInput}
                disabled={isProcessing}
              />
              <KeypadButton
                value="3"
                label="GHI"
                onClick={handleKeypadInput}
                disabled={isProcessing}
              />
              <KeypadButton
                value="4"
                label="JKL"
                onClick={handleKeypadInput}
                disabled={isProcessing}
              />
              <KeypadButton
                value="5"
                label="MNO"
                onClick={handleKeypadInput}
                disabled={isProcessing}
              />
              <KeypadButton
                value="6"
                label="PQRS"
                onClick={handleKeypadInput}
                disabled={isProcessing}
              />
              <KeypadButton
                value="7"
                label="TUV"
                onClick={handleKeypadInput}
                disabled={isProcessing}
              />
              <KeypadButton
                value="8"
                label="WXYZ"
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

            {/* Sound Toggle */}
            <div className="flex justify-center mt-6">
              <button
                onClick={() => handleKeypadInput("sound")}
                className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
              >
                {isSoundEnabled ? (
                  <svg
                    className="w-8 h-8 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-8 h-8 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
                    />
                  </svg>
                )}
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
