"use client";

import { BottomNavigation } from "@/components/BottomNavigation";
import { usePathname } from "next/navigation";
import { ToastProvider } from "@/components/ui/toast";

export default function LayoutClient({
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
    <ToastProvider>
      <div className="relative flex h-screen flex-col overflow-hidden">
        <main className="flex-1 overflow-hidden">{children}</main>
        {!hideBottomNav && <BottomNavigation isDark={isDarkNavigation} />}
      </div>
    </ToastProvider>
  );
}
