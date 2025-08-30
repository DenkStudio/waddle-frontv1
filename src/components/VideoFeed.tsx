"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Image from "next/image";

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
      v.muted = isMuted; // mantener coherencia
      try {
        if (!isUserPaused) {
          await v.play();
        }
      } catch (_) {
        // iOS/Safari podría bloquear; ignoramos error
      }
    },
    [isMuted, isUserPaused]
  );

  const pauseVideoAt = useCallback((i: number) => {
    const v = videoRefs.current[i];
    if (!v) return;
    v.pause();
  }, []);

  // ────────────────────────────────────────────────────────────────────────────
  // IntersectionObserver para autoplay/pausa según visibilidad (>60%)
  // ────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        let mostVisibleIdx: number | null = null;
        let bestRatio = 0;

        entries.forEach((entry) => {
          const target = entry.target as HTMLVideoElement;
          const idxAttr = target.getAttribute("data-index");
          const idx = idxAttr ? parseInt(idxAttr, 10) : -1;
          const ratio = entry.intersectionRatio;

          if (ratio > 0.6) {
            playVideoAt(idx);
          } else {
            pauseVideoAt(idx);
          }

          if (ratio > bestRatio) {
            bestRatio = ratio;
            mostVisibleIdx = idx;
          }
        });

        if (mostVisibleIdx !== null && mostVisibleIdx !== currentIndex) {
          setCurrentIndex(mostVisibleIdx);
          onIndexChange?.(mostVisibleIdx);
        }
      },
      {
        root: container,
        threshold: [0, 0.25, 0.6, 0.9, 1],
      }
    );

    // observar cada <video>
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

  // Snap manual con wheel/teclas
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let wheelBlock = false;
    let wheelTimeout: ReturnType<typeof setTimeout> | null = null;

    const onWheel = (e: WheelEvent) => {
      // Deja que el scroll-snap haga lo suyo, pero aceleramos el snap
      if (wheelBlock) return;
      wheelBlock = true;
      const dir = e.deltaY > 0 ? 1 : -1;
      const next = clampIndex(currentIndex + dir);
      scrollToIndex(next);
      if (wheelTimeout) clearTimeout(wheelTimeout);
      wheelTimeout = setTimeout(() => (wheelBlock = false), 350);
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        scrollToIndex(currentIndex + 1);
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        scrollToIndex(currentIndex - 1);
      }
    };

    container.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      container.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      if (wheelTimeout) clearTimeout(wheelTimeout);
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
      const threshold = 50; // px
      if (Math.abs(movedY) > threshold) {
        const dir = movedY < 0 ? 1 : -1; // arriba → siguiente
        scrollToIndex(currentIndex + dir);
      } else {
        // Snap al más cercano por si quedó en medio
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

  // ────────────────────────────────────────────────────────────────────────────
  // Handlers UI
  // ────────────────────────────────────────────────────────────────────────────
  const toggleMute = useCallback(() => setIsMuted((m) => !m), []);

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

  const goNext = useCallback(
    () => scrollToIndex(currentIndex + 1),
    [currentIndex, scrollToIndex]
  );
  const goPrev = useCallback(
    () => scrollToIndex(currentIndex - 1),
    [currentIndex, scrollToIndex]
  );

  // ────────────────────────────────────────────────────────────────────────────
  // UI
  // ──────────────────────────────────────────────────────────────────────────────
  return (
    <div className="relative h-screen w-full bg-black">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Left side - Logo/Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <Image
                src="/images/profile.png"
                alt="Waddle"
                width={32}
                height={32}
              />
            </div>
          </div>
          <Image
            src="/logos/logo-white.svg"
            alt="Waddle"
            width={32}
            height={32}
          />

          {/* Right side - Notifications & Profile */}
          <div className="flex items-center space-x-3">
            <button className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <svg
                className="w-4 h-4 text-white/60"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Video Feed Container - Adjusted for header height */}
      <div
        ref={containerRef}
        className="relative h-screen w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth bg-black [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pt-16"
        aria-label="TikTok-like video feed"
      >
        {videos.map((v, i) => (
          <section
            key={v.id}
            className="relative h-screen w-full snap-start"
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
              // iOS requiere interacción en algunos casos si no está muted
              onClick={togglePlay}
            />

            {/* Gradiente para legibilidad del caption */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/70 to-transparent" />

            {/* HUD / Controles */}
            <div className="absolute inset-0 flex items-end justify-between p-4 sm:p-6">
              {/* Texto izquierda */}
              <div className="max-w-[75%] text-white select-none">
                {v.author && (
                  <p className="mb-1 text-sm/5 opacity-90">@{v.author}</p>
                )}
                {v.caption && (
                  <p className="text-base/6 font-medium drop-shadow-[0_1px_1px_rgba(0,0,0,0.6)]">
                    {v.caption}
                  </p>
                )}
              </div>

              {/* Botonera derecha */}
              <div className="flex flex-col items-center gap-3 text-white">
                <IconButton label="Mute/Unmute" onClick={toggleMute}>
                  {isMuted ? (
                    <SpeakerOffIcon className="h-7 w-7" />
                  ) : (
                    <SpeakerOnIcon className="h-7 w-7" />
                  )}
                </IconButton>

                <IconButton label="Play/Pause" onClick={togglePlay}>
                  {isUserPaused ? (
                    <PlayIcon className="h-7 w-7" />
                  ) : (
                    <PauseIcon className="h-7 w-7" />
                  )}
                </IconButton>

                <IconButton label="Anterior" onClick={goPrev}>
                  <UpIcon className="h-7 w-7" />
                </IconButton>
                <IconButton label="Siguiente" onClick={goNext}>
                  <DownIcon className="h-7 w-7" />
                </IconButton>

                {typeof v.likes === "number" && (
                  <div className="mt-2 text-center text-xs opacity-90">
                    <p className="font-semibold">❤ {formatNumber(v.likes)}</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Componentes auxiliares
// ──────────────────────────────────────────────────────────────────────────────
function IconButton({
  children,
  onClick,
  label,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 backdrop-blur-md transition active:scale-95"
    >
      {children}
    </button>
  );
}

function PlayIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}
function PauseIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
    </svg>
  );
}
function SpeakerOffIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M16.5 12l3-3 1.5 1.5-3 3 3 3-1.5 1.5-3-3-3 3L12 16.5l3-3-3-3L13.5 7l3 3zM3 9h4l5-4v14l-5-4H3z" />
    </svg>
  );
}
function SpeakerOnIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M14 3.23v17.53c3.39-1.19 6-4.39 6-8.77s-2.61-7.58-6-8.76zM3 9h4l5-4v14l-5-4H3z" />
    </svg>
  );
}
function UpIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M7 14l5-5 5 5H7z" />
    </svg>
  );
}
function DownIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M7 10l5 5 5-5H7z" />
    </svg>
  );
}

function formatNumber(n?: number) {
  if (typeof n !== "number") return "";
  return new Intl.NumberFormat("es-AR", { notation: "compact" }).format(n);
}
