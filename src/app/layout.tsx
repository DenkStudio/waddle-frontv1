"use client";

import { aeonik } from "../lib/fonts";
import { BottomNavigation } from "@/components/BottomNavigation";
import { usePathname } from "next/navigation";
import { ToastProvider } from "@/components/ui/toast";
import "./globals.css";

// Note: Since this is now a client component, metadata needs to be handled differently
// You may want to use Next.js head or a separate metadata component

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Don't show bottom navigation on login page
  const hideBottomNav = pathname === "/login";

  return (
    <html lang="en" className={`${aeonik.variable}`}>
      <body className="min-h-screen bg-background antialiased font-aeonik">
        <ToastProvider>
          <div className="relative flex min-h-screen flex-col">
            <main className="flex-1">{children}</main>
            {!hideBottomNav && <BottomNavigation isDark={false} />}
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
