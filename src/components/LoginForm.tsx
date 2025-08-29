"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login attempt:", { email, password });
  };

  const handleAppleLogin = () => {
    console.log("Apple login");
  };

  const handleMetamaskLogin = () => {
    console.log("Metamask login");
  };

  const handleGoogleLogin = () => {
    console.log("Google login");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="relative h-80  overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src="/login.mp4" type="video/mp4" />
        </video>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/90 to-transparent z-10"></div>

        <Image
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 z-20"
          src="/logos/logo.svg"
          alt="Login"
          width={120}
          height={120}
        />
      </div>
      <div className="flex-1 bg-white px-4 py-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-normal text-gray-900 text-center mb-8">
            Sign in or create an account
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            <div>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-0 border-b-2 border-gray-300 focus:border-purple-400 focus:ring-0 rounded-none px-0 py-3 bg-transparent"
                required
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-0 border-b-2 border-gray-300 focus:border-purple-400 focus:ring-0 rounded-none px-0 py-3 bg-transparent"
                required
              />
            </div>
          </form>

          <div className="text-center mb-6">
            <span className="text-gray-500 text-sm">or</span>
          </div>

          <div className="space-y-3 mb-24">
            <Button
              onClick={handleAppleLogin}
              variant="black"
              leftIcon={
                <Image
                  src="/logos/apple.svg"
                  alt="Apple"
                  width={20}
                  height={20}
                />
              }
            >
              Continue with Apple
            </Button>

            <Button
              onClick={handleMetamaskLogin}
              variant="gray"
              leftIcon={
                <Image
                  src="/logos/metamask.svg"
                  alt="Metamask"
                  width={20}
                  height={20}
                />
              }
            >
              Continue with Metamask
            </Button>

            <Button
              onClick={handleGoogleLogin}
              variant="gray"
              leftIcon={
                <Image
                  src="/logos/google.svg"
                  alt="Google"
                  width={20}
                  height={20}
                />
              }
            >
              Continue with Google
            </Button>
          </div>

          <Button onClick={handleSubmit} variant="blue" className="w-full">
            Login
          </Button>
        </div>
      </div>
    </div>
  );
}
