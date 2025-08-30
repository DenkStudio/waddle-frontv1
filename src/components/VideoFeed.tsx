"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Button } from "./ui/button";
import VaultCard from "./ui/VaultCard";

// ──────────────────────────────────────────────────────────────────────────────
// Tipos
// ──────────────────────────────────────────────────────────────────────────────
export type FeedVideo = {
  id: string;
  src: string; // MP4/HLS (si es HLS usar un <video> compatible o librería aparte)
  poster?: string;
  caption?: string;
  author?: string;
  likes?: number;
};

export type TikTokFeedProps = {
  videos: FeedVideo[];
  initialIndex?: number;
  onIndexChange?: (index: number) => void;
  onVideoEnd?: (videoId: string) => void;
  onVideoPlay?: (videoId: string) => void;
  onVideoPause?: (videoId: string) => void;
};

// ──────────────────────────────────────────────────────────────────────────────
// Componente principal
// ──────────────────────────────────────────────────────────────────────────────
export default function TikTokFeed({
  videos,
  initialIndex = 0,
  onIndexChange,
  onVideoEnd,
  onVideoPlay,
  onVideoPause,
}: TikTokFeedProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const [currentIndex, setCurrentIndex] = useState(
    Math.min(Math.max(0, initialIndex), Math.max(0, videos.length - 1))
  );
  const [isMuted, setIsMuted] = useState(true);
  const [isUserPaused, setIsUserPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Control de paginación para wheel/trackpad
  const isPagingRef = useRef(false);
  const targetIndexRef = useRef<number | null>(null);
  const wheelAccumRef = useRef(0);

  // ────────────────────────────────────────────────────────────────────────────
  // Utilidades
  // ────────────────────────────────────────────────────────────────────────────
  const clampIndex = useCallback(
    (i: number) => Math.min(Math.max(0, i), videos.length - 1),
    [videos.length]
  );

  const scrollToIndex = useCallback(
    (i: number, behavior: ScrollBehavior = "smooth") => {
      const idx = clampIndex(i);
      const container = containerRef.current;
      if (!container) return;
      const viewportH = container.clientHeight;
      container.scrollTo({ top: idx * viewportH, behavior });
    },
    [clampIndex]
  );

  const playVideoAt = useCallback(
    async (i: number) => {
      const v = videoRefs.current[i];
      if (!v) return;
      v.muted = isMuted;
      try {
        if (!isUserPaused) await v.play();
      } catch {}
    },
    [isMuted, isUserPaused]
  );

  const pauseVideoAt = useCallback((i: number) => {
    const v = videoRefs.current[i];
    if (!v) return;
    v.pause();
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        let mostVisibleIdx: number | null = null;
        let bestRatio = 0;

        entries.forEach((entry) => {
          const target = entry.target as HTMLVideoElement;
          const idx = parseInt(target.getAttribute("data-index") || "-1", 10);
          const ratio = entry.intersectionRatio;

          if (ratio > 0.6) playVideoAt(idx);
          else pauseVideoAt(idx);

          if (ratio > bestRatio) {
            bestRatio = ratio;
            mostVisibleIdx = idx;
          }
        });

        if (mostVisibleIdx == null) return;

        if (isPagingRef.current) {
          if (targetIndexRef.current === mostVisibleIdx && bestRatio >= 0.88) {
            setCurrentIndex(mostVisibleIdx);
            onIndexChange?.(mostVisibleIdx);
          }
          return;
        }

        if (mostVisibleIdx !== currentIndex) {
          setCurrentIndex(mostVisibleIdx);
          onIndexChange?.(mostVisibleIdx);
        }
      },
      { root: container, threshold: [0, 0.25, 0.6, 0.88, 1] }
    );

    videoRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [currentIndex, onIndexChange, pauseVideoAt, playVideoAt]);

  // mantener mute en todos los videos cuando cambie el estado
  useEffect(() => {
    videoRefs.current.forEach((v) => {
      if (v) v.muted = isMuted;
    });
  }, [isMuted]);

  // Ajustar scroll a initialIndex en el primer render
  useEffect(() => {
    const id = requestAnimationFrame(() => scrollToIndex(currentIndex, "auto"));
    return () => cancelAnimationFrame(id);
  }, []); // eslint-disable-line

  // Wheel/trackpad → un gesto = 1 paso (acumulador + cooldown)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const THRESHOLD = 120;
    const COOLDOWN_MS = 420;

    let cooldownTimer: ReturnType<typeof setTimeout> | null = null;

    const unlock = () => {
      isPagingRef.current = false;
      targetIndexRef.current = null;
      wheelAccumRef.current = 0;
    };

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;
      e.preventDefault();

      if (isPagingRef.current) return;

      wheelAccumRef.current += e.deltaY;

      if (Math.abs(wheelAccumRef.current) >= THRESHOLD) {
        const dir = wheelAccumRef.current > 0 ? 1 : -1;
        wheelAccumRef.current = 0;

        const next = clampIndex(currentIndex + dir);
        if (next !== currentIndex) {
          isPagingRef.current = true;
          targetIndexRef.current = next;
          scrollToIndex(next, "auto");

          if (cooldownTimer) clearTimeout(cooldownTimer);
          cooldownTimer = setTimeout(unlock, COOLDOWN_MS);
        }
      }
    };

    container.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      container.removeEventListener("wheel", onWheel);
      if (cooldownTimer) clearTimeout(cooldownTimer);
    };
  }, [currentIndex, clampIndex, scrollToIndex]);

  // Gestos táctiles (swipe)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let startY = 0;
    let movedY = 0;

    const onTouchStart = (e: TouchEvent) => {
      setIsDragging(true);
      startY = e.touches[0].clientY;
      movedY = 0;
    };

    const onTouchMove = (e: TouchEvent) => {
      movedY = e.touches[0].clientY - startY;
    };

    const onTouchEnd = () => {
      setIsDragging(false);
      const threshold = 50;
      if (Math.abs(movedY) > threshold) {
        const dir = movedY < 0 ? 1 : -1;
        scrollToIndex(currentIndex + dir);
      } else {
        scrollToIndex(currentIndex);
      }
    };

    container.addEventListener("touchstart", onTouchStart, { passive: true });
    container.addEventListener("touchmove", onTouchMove, { passive: true });
    container.addEventListener("touchend", onTouchEnd);

    return () => {
      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchmove", onTouchMove);
      container.removeEventListener("touchend", onTouchEnd);
    };
  }, [currentIndex, scrollToIndex]);

  const togglePlay = useCallback(() => {
    const v = videoRefs.current[currentIndex];
    if (!v) return;
    if (v.paused) {
      setIsUserPaused(false);
      v.play().catch(() => {});
    } else {
      setIsUserPaused(true);
      v.pause();
    }
  }, [currentIndex]);

  return (
    <div className="relative h-full w-full bg-black">
      <div
        ref={containerRef}
        className="relative h-full w-full overflow-y-scroll snap-y snap-mandatory bg-black overscroll-y-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pt-16"
        aria-label="TikTok-like video feed"
      >
        {videos.map((v, i) => (
          <section
            key={v.id}
            className="relative h-screen w-full snap-start snap-always"
            aria-roledescription="slide"
            aria-label={`Video ${i + 1} de ${videos.length}`}
          >
            <video
              ref={(el) => {
                videoRefs.current[i] = el;
              }}
              data-index={i}
              className="h-full w-full object-cover"
              src={v.src}
              poster={v.poster}
              playsInline
              muted
              loop
              preload="metadata"
              onClick={togglePlay}
            />

            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

            <div className="absolute left-2 right-2 bottom-32">
              <VaultCard />
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
