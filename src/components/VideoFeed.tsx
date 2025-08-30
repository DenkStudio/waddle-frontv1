"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Button } from "./ui/button";

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
};

// ──────────────────────────────────────────────────────────────────────────────
// Componente principal
// ──────────────────────────────────────────────────────────────────────────────
export default function TikTokFeed({
  videos,
  initialIndex = 0,
  onIndexChange,
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
    <div className="relative h-screen w-full bg-black">
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
              <Image
                src="/images/profile.png"
                alt="Waddle"
                width={64}
                height={64}
              />
            </div>
          </div>
          <div className="">
            <Image
              src="/logos/logo-white.svg"
              alt="Waddle"
              width={64}
              height={64}
            />
          </div>
          <div className="flex items-center space-x-3">
            <button className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <Image
                src="/logos/search.svg"
                alt="Notification"
                width={24}
                height={24}
              />
            </button>
          </div>
        </div>
      </header>

      <div
        ref={containerRef}
        className="relative h-screen w-full overflow-y-scroll snap-y snap-mandatory bg-black overscroll-y-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pt-16"
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
              <div className="relative rounded-[40px] border border-white/20 bg-black/50 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,.8)] overflow-hidden">
                <div className="pointer-events-none absolute inset-0 rounded-[40px] bg-[linear-gradient(180deg,rgba(255,255,255,.10)_0%,rgba(255,255,255,.04)_35%,rgba(0,0,0,.40)_100%)]" />
                <div className="pointer-events-none absolute inset-0 rounded-[40px] ring-1 ring-inset ring-white/5" />
                <div className="pointer-events-none absolute inset-0 rounded-[40px] bg-[radial-gradient(120%_140%_at_50%_120%,transparent,rgba(0,0,0,.35))]" />

                <div className="relative p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center">
                        <svg
                          className="h-6 w-6 text-black"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M12 2C7.03 2 3 6.03 3 11s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 3.5c1.65 0 3 1.35 3 3 0 2.25-3 5-3 5s-3-2.75-3-5c0-1.65 1.35-3 3-3z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-xl leading-6">
                          Insiders Club
                        </h3>
                        <p className="text-white/70 text-[15px] leading-5">
                          @cryptowhale
                        </p>
                      </div>
                    </div>

                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path d="M7 4h10a2 2 0 012 2v13l-7-3-7 3V6a2 2 0 012-2z" />
                    </svg>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-5">
                    <span className="px-4 py-2 rounded-full bg-white/10 text-white/90 text-sm border border-white/15 shadow-inner backdrop-blur-sm">
                      Liquidity <span className="font-semibold">+$52m</span>
                    </span>
                    <span className="px-4 py-2 rounded-full bg-white/10 text-white/90 text-sm border border-white/15 shadow-inner backdrop-blur-sm">
                      Yield{" "}
                      <span className="text-green-400 font-semibold">
                        +12.5%
                      </span>
                    </span>
                    <span className="px-4 py-2 rounded-full bg-white/10 text-white/90 text-sm border border-white/15 shadow-inner backdrop-blur-sm">
                      91 days ago
                    </span>
                  </div>

                  <div className="flex items-center">
                    <div className="relative flex-1 mr-3">
                      <span className="pointer-events-none absolute -inset-x-6 -inset-y-2 rounded-[28px] bg-[radial-gradient(60%_120%_at_50%_100%,rgba(59,130,246,.55),transparent)] blur-2xl opacity-80" />
                      <Button variant="gradient-blue">View vault</Button>
                    </div>

                    <button
                      aria-label="Share"
                      className="h-12 w-12 rounded-full bg-white/5 border border-white/15 backdrop-blur-sm flex items-center justify-center hover:bg-white/10 transition"
                    >
                      <Image
                        src="/logos/redirect.svg"
                        alt="Share"
                        width={20}
                        height={20}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
