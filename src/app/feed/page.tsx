"use client";

import React from "react";
import { sampleVideos } from "@/lib/sampleVideos";
import TikTokFeed from "@/components/VideoFeed";
import Image from "next/image";
import { Header } from "@/components/Header";
import WaddleColored from "../../../public/icons/WaddleColored";

export default function FeedPage() {
  const handleVideoEnd = (videoId: string) => {
    console.log(`Video ${videoId} ended`);
  };

  const handleVideoPlay = (videoId: string) => {
    console.log(`Video ${videoId} started playing`);
  };

  const handleVideoPause = (videoId: string) => {
    console.log(`Video ${videoId} paused`);
  };

  return (
    <div className="w-full h-full bg-black overflow-hidden">
      <Header
        className="absolute top-0 left-0 right-0 z-50"
        transparent={true}
        leftComponent={
          <Image
            src="/images/profile.png"
            alt="Waddle"
            width={42}
            height={42}
          />
        }
        centerComponent={
          <WaddleColored />
        }
        rightComponent={
          <button className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <Image
              src="/logos/search.svg"
              alt="Notification"
              width={20}
              height={20}
            />
          </button>
        }
      />
      <TikTokFeed
        videos={sampleVideos}
        onVideoEnd={handleVideoEnd}
        onVideoPlay={handleVideoPlay}
        onVideoPause={handleVideoPause}
      />
    </div>
  );
}
