import type { Metadata } from "next";
import { aeonik } from "../lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Waddle Front",
    template: "%s | Waddle Front",
  },
  description: "A modern Next.js application built with best practices",
  keywords: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
  authors: [{ name: "Your Name" }],
  creator: "Your Name",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://your-domain.com",
    title: "Waddle Front",
    description: "A modern Next.js application built with best practices",
    siteName: "Waddle Front",
  },
  twitter: {
    card: "summary_large_image",
    title: "Waddle Front",
    description: "A modern Next.js application built with best practices",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${aeonik.variable}`}>
      <body className="min-h-screen bg-background antialiased font-aeonik">
        <div className="relative flex min-h-screen flex-col">
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
