"use client";

import React from "react";
import { sampleVideos } from "@/lib/sampleVideos";
import TikTokFeed from "@/components/VideoFeed";

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
    <div className="w-full h-screen bg-black">
      <TikTokFeed
        videos={sampleVideos}
        onVideoEnd={handleVideoEnd}
        onVideoPlay={handleVideoPlay}
        onVideoPause={handleVideoPause}
      />
    </div>
  );
}
