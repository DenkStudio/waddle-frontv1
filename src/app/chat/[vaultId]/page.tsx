"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";

interface ChatMessage {
  id: string;
  username: string;
  handle: string;
  message: string;
  timeAgo: string;
  avatar: string;
  isOnline: boolean;
  isVerified?: boolean;
}

export default function ChatPage() {
  const router = useRouter();
  const params = useParams();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const vaultId = params.vaultId as string;

  const [activeTab, setActiveTab] = useState<"Chat" | "Members">("Chat");
  const [newMessage, setNewMessage] = useState("");

  // Mock chat data based on the image
  const chatMessages: ChatMessage[] = [
    {
      id: "1",
      username: "Alex Thompson",
      handle: "@alexthompson",
      message:
        "I think SOL is showing strong momentum — do you guys see resistance around $110?",
      timeAgo: "2 days ago",
      avatar: "/images/Avatar.jpg",
      isOnline: true,
    },
    {
      id: "2",
      username: "Lana Steiner",
      handle: "@lanasteiner",
      message:
        "Also, are we planning to increase exposure to ETH this week or wait for confirmation?",
      timeAgo: "2 days ago",
      avatar: "/images/Avatar (1).jpg",
      isOnline: true,
    },
    {
      id: "3",
      username: "@cryptowhale.eth",
      handle: "@cryptowhale.eth",
      message:
        "We're looking at partial exits around $3,450 - $3,500. Will update if that changes.",
      timeAgo: "2 days ago",
      avatar: "/images/Avatar.png",
      isOnline: true,
      isVerified: true,
    },
    {
      id: "4",
      username: "Demi Wilkinson",
      handle: "@demiwilkinson",
      message: "Hey Insiders 👋 — is now a good time to add more ETH?",
      timeAgo: "2:20pm",
      avatar: "/images/Avatar (1).jpg",
      isOnline: true,
    },
  ];

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Handle sending message logic here
      console.log("Sending message:", newMessage);
      setNewMessage("");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <div className="text-center">
            <div className="text-sm text-gray-500">Chat</div>
            <div className="text-lg font-semibold text-gray-900">
              Insiders Club
            </div>
          </div>
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <svg
            className="w-6 h-6 text-gray-600"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path d="M12 5v.01M12 12v.01M12 19v.01" />
          </svg>
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex bg-white px-4 py-3 gap-2">
        <button
          onClick={() => setActiveTab("Chat")}
          className={`px-4 py-2 rounded-full font-medium transition-colors ${
            activeTab === "Chat"
              ? "bg-gray-900 text-white"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Chat
        </button>
        <button
          onClick={() => setActiveTab("Members")}
          className={`px-4 py-2 rounded-full font-medium transition-colors ${
            activeTab === "Members"
              ? "bg-gray-900 text-white"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Members
        </button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-gray-50">
        {chatMessages.map((message, index) => (
          <div key={message.id}>
            {/* Date separator for "Today" */}
            {index === 3 && (
              <div className="flex items-center justify-center my-8">
                <div className="text-sm text-gray-500 font-medium">Today</div>
              </div>
            )}

            <div className="flex gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0 overflow-hidden">
                  <Image
                    src={message.avatar}
                    alt={message.username}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `data:image/svg+xml;base64,${btoa(
                        `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><rect width="40" height="40" fill="#e5e7eb"/><text x="20" y="25" text-anchor="middle" fill="#9ca3af" font-family="Arial" font-size="14">${message.username.charAt(
                          0
                        )}</text></svg>`
                      )}`;
                    }}
                  />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-gray-900 text-sm">
                    {message.username}
                  </span>
                  {message.isVerified && (
                    <svg
                      className="w-4 h-4 text-gray-600"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  <span className="text-xs text-gray-500 ml-auto">
                    {message.timeAgo}
                  </span>
                </div>
                <div className="mt-1">
                  <p className="text-gray-900 text-sm leading-relaxed">
                    {message.message}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Join vault to chat"
              className="w-full px-4 py-3 bg-gray-100 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage();
                }
              }}
            />
          </div>
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </button>
          <button
            onClick={handleSendMessage}
            className="p-3 bg-black rounded-full text-white hover:bg-gray-800 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>

      {/* Bottom safe area for mobile */}
      <div className="h-safe-area-inset-bottom bg-white"></div>
    </div>
  );
}
