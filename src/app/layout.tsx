"use client";

import { aeonik } from "../lib/fonts";
import { BottomNavigation } from "@/components/BottomNavigation";
import { usePathname } from "next/navigation";
import { ToastProvider } from "@/components/ui/toast";
import { Providers } from "./providers";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Don't show bottom navigation on login page and chat pages
  const hideBottomNav = pathname === "/login" || pathname.startsWith("/chat");
  const darkRoutes = ["/feed", "/another-dark-page"];
  const isDarkNavigation = darkRoutes.includes(pathname);

  return (
    <Providers>
      <html lang="en" className={`${aeonik.variable}`}>
        <head>
          {/* Basic Meta Tags */}
          <meta charSet="utf-8" />
          <title>Waddle - Crypto Trading App</title>
          <meta
            name="description"
            content="Crypto trading and portfolio management app"
          />

          {/* PWA Meta Tags */}
          <meta name="application-name" content="Waddle" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="black-translucent"
          />
          <meta name="apple-mobile-web-app-title" content="Waddle" />
          <meta name="format-detection" content="telephone=no" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="msapplication-TileColor" content="#3b82f6" />
          <meta name="msapplication-tap-highlight" content="no" />
          <meta name="theme-color" content="#3b82f6" />

          {/* Viewport - Critical for PWA */}
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
          />

          {/* Apple Touch Icons */}
          <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
          <link
            rel="apple-touch-icon"
            sizes="152x152"
            href="/apple-touch-icon.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-touch-icon.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="167x167"
            href="/apple-touch-icon.png"
          />

          {/* Manifest */}
          <link rel="manifest" href="/manifest.json" />

          {/* Favicons */}
          <link rel="icon" type="image/svg+xml" href="/logos/logo.svg" />
          <link rel="shortcut icon" href="/favicon.ico" />

          {/* PWA Styles */}
          <style
            dangerouslySetInnerHTML={{
              __html: `
            /* PWA-specific styles */
            body {
              overscroll-behavior-y: none;
              -webkit-overflow-scrolling: touch;
              -webkit-user-select: none;
              user-select: none;
            }
            
            /* Prevent zoom on input focus */
            input, select, textarea {
              font-size: 16px !important;
              -webkit-user-select: auto;
              user-select: auto;
            }
            
            /* Remove iOS highlights and callouts */
            * {
              -webkit-tap-highlight-color: transparent;
              -webkit-touch-callout: none;
            }
            
            /* Allow text selection where needed */
            p, span, h1, h2, h3, h4, h5, h6 {
              -webkit-user-select: auto;
              user-select: auto;
            }
            
            /* Hide iOS safe area when in standalone mode */
            @media (display-mode: standalone) {
              body {
                padding-top: env(safe-area-inset-top);
                padding-bottom: env(safe-area-inset-bottom);
                padding-left: env(safe-area-inset-left);
                padding-right: env(safe-area-inset-right);
              }
            }
          `,
            }}
          />
        </head>
        <body className="h-screen bg-background antialiased font-aeonik overflow-hidden">
          <ToastProvider>
            <div className="relative flex h-screen flex-col overflow-hidden">
              <main className="flex-1 overflow-hidden">{children}</main>
              {!hideBottomNav && <BottomNavigation isDark={isDarkNavigation} />}
            </div>
          </ToastProvider>
        </body>
      </html>
    </Providers>
  );
}
