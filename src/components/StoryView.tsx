"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { FeedVideo } from "./VideoFeed";

export type StoryViewProps = {
  videos: FeedVideo[];
  isOpen: boolean;
  onClose: () => void;
  initialIndex?: number;
  userName?: string;
  userHandle?: string;
};

export default function StoryView({
  videos,
  isOpen,
  onClose,
  initialIndex = 0,
  userName = "BeinCrypto",
  userHandle = "@beincrypto",
}: StoryViewProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const currentVideo = videos[currentIndex];

  // Update progress bar
  const updateProgress = useCallback(() => {
    const video = videoRef.current;
    if (!video || video.duration === 0) return;

    const progressPercent = (video.currentTime / video.duration) * 100;
    setProgress(progressPercent);
  }, []);

  // Start progress tracking
  const startProgressTracking = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    progressIntervalRef.current = setInterval(updateProgress, 100);
  }, [updateProgress]);

  // Stop progress tracking
  const stopProgressTracking = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, []);

  // Go to next story
  const nextStory = useCallback(() => {
    if (currentIndex < videos.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setProgress(0);
    } else {
      onClose();
    }
  }, [currentIndex, videos.length, onClose]);

  // Go to previous story
  const prevStory = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setProgress(0);
    }
  }, [currentIndex]);

  // Toggle play/pause
  const togglePlayPause = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPaused(false);
      startProgressTracking();
    } else {
      video.pause();
      setIsPaused(true);
      stopProgressTracking();
    }
  }, [startProgressTracking, stopProgressTracking]);

  // Handle video events
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => {
      setIsPaused(false);
      startProgressTracking();
    };

    const handlePause = () => {
      setIsPaused(true);
      stopProgressTracking();
    };

    const handleEnded = () => {
      nextStory();
    };

    const handleLoadedData = () => {
      setProgress(0);
      if (!isPaused) {
        video.play().catch(() => {});
      }
    };

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("ended", handleEnded);
    video.addEventListener("loadeddata", handleLoadedData);

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("loadeddata", handleLoadedData);
    };
  }, [isPaused, nextStory, startProgressTracking, stopProgressTracking]);

  // Auto-play when video changes
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isOpen) return;

    video.currentTime = 0;
    video.muted = isMuted;
    setProgress(0);

    if (!isPaused) {
      video.play().catch(() => {});
    }
  }, [currentIndex, isOpen, isMuted, isPaused]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopProgressTracking();
    };
  }, [stopProgressTracking]);

  // Handle keyboard events
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case " ":
          e.preventDefault();
          togglePlayPause();
          break;
        case "ArrowLeft":
          prevStory();
          break;
        case "ArrowRight":
          nextStory();
          break;
        case "m":
        case "M":
          setIsMuted(!isMuted);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, togglePlayPause, prevStory, nextStory, isMuted]);

  if (!isOpen || !currentVideo) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/90" onClick={onClose} />

      {/* Story container */}
      <div className="relative w-full max-w-sm h-full flex flex-col">
        {/* Progress bars */}
        <div className="absolute top-4 left-4 right-4 z-10 flex gap-1">
          {videos.map((_, index) => (
            <div
              key={index}
              className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden"
            >
              <div
                className="h-full bg-white rounded-full transition-all duration-100 ease-linear"
                style={{
                  width:
                    index < currentIndex
                      ? "100%"
                      : index === currentIndex
                      ? `${progress}%`
                      : "0%",
                }}
              />
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="absolute top-12 left-4 right-4 z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              {/* Story ring */}
              <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-400 p-0.5">
                <div className="h-full w-full rounded-full bg-black flex items-center justify-center">
                  <span className="text-white font-bold text-xs">BC</span>
                </div>
              </div>
            </div>
            <div className="bg-black/40 backdrop-blur-sm rounded-lg px-3 py-1">
              <h3 className="text-white font-semibold text-sm">{userName}</h3>
              <p className="text-white/90 text-xs">{userHandle}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="bg-black/50 backdrop-blur-sm rounded-full p-2 text-white hover:bg-black/70 hover:text-white transition-all"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Video */}
        <div className="flex-1 relative">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            src={currentVideo.src}
            poster={currentVideo.poster}
            playsInline
            muted={isMuted}
            loop={false}
          />

          {/* Tap areas for navigation */}
          <div className="absolute inset-0 flex">
            {/* Left tap area - previous story */}
            <div className="flex-1 cursor-pointer" onClick={prevStory} />
            {/* Center tap area - play/pause */}
            <div
              className="flex-1 cursor-pointer flex items-center justify-center"
              onClick={togglePlayPause}
            >
              {isPaused && (
                <div className="bg-black/50 rounded-full p-4">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              )}
            </div>
            {/* Right tap area - next story */}
            <div className="flex-1 cursor-pointer" onClick={nextStory} />
          </div>
        </div>

        {/* Bottom controls */}
        <div className="absolute bottom-20 left-4 right-4 z-10">
          <div className="flex items-center gap-4 text-white">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 bg-black/30 rounded-full hover:bg-black/50 transition-colors"
            >
              {isMuted ? (
                <svg
                  className="w-5 h-5"
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
              ) : (
                <svg
                  className="w-5 h-5"
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
              )}
            </button>
          </div>
        </div>

        {/* Comment input area */}
        <div className="absolute bottom-4 left-4 right-16 z-10">
          <div className="bg-black/30 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2">
            <input
              type="text"
              placeholder="Comment"
              className="w-full bg-transparent text-white placeholder-white/60 text-sm focus:outline-none"
            />
          </div>
        </div>

        {/* Send button */}
        <div className="absolute bottom-4 right-4 z-10">
          <button className="bg-blue-500 hover:bg-blue-600 rounded-full p-3 transition-colors">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
