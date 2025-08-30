"use client";

import React from "react";
import { usePrivy } from "@privy-io/react-auth";

interface SettingsMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsMenu({ isOpen, onClose }: SettingsMenuProps) {
  const { logout } = usePrivy();

  const handleLogout = async () => {
    try {
      await logout();
      onClose();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      {/* Menu */}
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 animate-slide-up">
        <div className="px-6 py-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-semibold text-gray-900">Settings</h2>
            <button
              onClick={onClose}
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
          </div>

          {/* Menu Items */}
          <div className="space-y-6">
            {/* App lock */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-medium text-gray-900">
                  App lock
                </h3>
                <p className="text-sm text-gray-500">
                  Require Face ID to unlock Waddle.
                </p>
              </div>
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only"
                  defaultChecked={false}
                />
                <div className="w-12 h-7 bg-gray-200 rounded-full relative cursor-pointer">
                  <div className="w-5 h-5 bg-white rounded-full absolute top-1 left-1 transition-transform"></div>
                </div>
              </div>
            </div>

            {/* Operations confirmation */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-medium text-gray-900">
                  Operations confirmation
                </h3>
                <p className="text-sm text-gray-500">Token purchases, swaps.</p>
              </div>
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only"
                  defaultChecked={true}
                />
                <div className="w-12 h-7 bg-green-500 rounded-full relative cursor-pointer">
                  <div className="w-5 h-5 bg-white rounded-full absolute top-1 right-1 transition-transform"></div>
                </div>
              </div>
            </div>

            {/* Logout */}
            <button onClick={handleLogout} className="text-left w-full">
              <h3 className="text-base font-medium text-red-500">Logout</h3>
            </button>
          </div>

          {/* Social Icons */}
          <div className="flex items-center justify-center space-x-6 mt-16 mb-8">
            <a href="#" className="text-gray-400 hover:text-gray-600">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-600">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001.017 0z" />
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-600">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
