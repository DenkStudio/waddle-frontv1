import React, { useState, useEffect } from "react";
import { getTokenLogoPath, getTokenName, hasTokenLogo } from "@/lib/tokenLogos";
import { cn } from "@/lib/utils";

interface TokenLogoProps {
  symbol: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showFallback?: boolean;
}

export function TokenLogo({
  symbol,
  size = "md",
  className,
  showFallback = true,
}: TokenLogoProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageTimeout, setImageTimeout] = useState(false);

  const logoPath = getTokenLogoPath(symbol);
  const tokenName = getTokenName(symbol);
  const hasLogo = hasTokenLogo(symbol);

  // Set a timeout to show fallback if image takes too long to load
  useEffect(() => {
    if (hasLogo && !imageError) {
      const timer = setTimeout(() => {
        if (!imageLoaded) {
          setImageTimeout(true);
        }
      }, 3000); // 3 second timeout

      return () => clearTimeout(timer);
    }
  }, [hasLogo, imageError, imageLoaded]);

  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10",
    xl: "w-12 h-12",
  };

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
    xl: "text-lg",
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageTimeout(false);
  };

  // If image failed to load, timed out, or we want to show fallback, render fallback
  if (imageError || imageTimeout || !showFallback || !hasLogo) {
    return (
      <div
        className={cn(
          "rounded-full bg-gray-800 flex items-center justify-center text-white font-medium",
          sizeClasses[size],
          className
        )}
        title={tokenName}
      >
        <span className={cn("font-bold", textSizes[size])}>
          {symbol.replace(/^\$/, "").slice(0, 2).toUpperCase()}
        </span>
      </div>
    );
  }

  return (
    <div className="relative">
      <img
        src={logoPath}
        alt={`${tokenName} logo`}
        className={cn(
          "rounded-full object-cover",
          sizeClasses[size],
          className,
          !imageLoaded && "opacity-0"
        )}
        onError={handleImageError}
        onLoad={handleImageLoad}
        title={tokenName}
        crossOrigin="anonymous"
      />
      {/* Loading state */}
      {!imageLoaded && !imageError && !imageTimeout && (
        <div
          className={cn(
            "absolute inset-0 rounded-full bg-gray-200 animate-pulse",
            sizeClasses[size]
          )}
        />
      )}
    </div>
  );
}
