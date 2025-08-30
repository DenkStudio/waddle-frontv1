"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { usePrivy } from "@privy-io/react-auth";

export default function LoginForm() {
  const { ready, authenticated, login } = usePrivy();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Redirect if already authenticated
  useEffect(() => {
    if (ready && authenticated) {
      router.push("/");
    }
  }, [ready, authenticated, router]);

  const handlePrivyLogin = async () => {
    if (!ready) return;

    setIsLoading(true);
    setError("");

    try {
      await login();
    } catch (err) {
      setError("Failed to sign in. Please try again.");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col relative">
      {/* Video section at top */}
      <div className="relative h-80">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0 -mt-4"
        >
          <source src="/login.mp4" type="video/mp4" />
        </video>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/90 to-transparent z-10"></div>

        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 z-[100] flex items-center justify-center">
          <Image src="/logos/logo.svg" alt="Logo" width={200} height={200} />
        </div>
      </div>

      {/* Main content section */}
      <div className="flex-1 bg-white flex flex-col items-center justify-center px-8 relative">
        {/* App name - much closer to logo */}
        <h1 className="text-[40px] font-light text-gray-900 mb-2 -mt-72 font-medium">
          waddle
        </h1>

        {/* Subtitle */}
        <p className="text-2xl text-gray-700 mb-16 text-center font-medium">
          Sign in or create an account
        </p>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm max-w-sm">
            {error}
          </div>
        )}

        {/* Start button at bottom */}
        <div className="absolute bottom-8 left-4 right-4">
          <Button
            onClick={handlePrivyLogin}
            className="w-full bg-black hover:bg-gray-800 text-white py-4 rounded-full text-lg font-medium"
            disabled={isLoading || !ready}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Signing in...
              </div>
            ) : (
              "Start"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
