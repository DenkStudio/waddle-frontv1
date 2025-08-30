// Environment configuration
export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  NEXT_PUBLIC_API_URL:
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
  NEXT_PUBLIC_APP_URL:
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  NEXT_PUBLIC_GOOGLE_ANALYTICS_ID: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID,
  NEXT_PUBLIC_CDP_CLIENT_API_KEY: process.env.NEXT_PUBLIC_CDP_CLIENT_API_KEY,

  // Mini App Manifest Configuration
  NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL || "http://localhost:3000",
  NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME:
    process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME || "Waddle",
  NEXT_PUBLIC_APP_SUBTITLE:
    process.env.NEXT_PUBLIC_APP_SUBTITLE || "Social Trading Platform",
  NEXT_PUBLIC_APP_DESCRIPTION:
    process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
    "Trade and invest in crypto vaults with social features",
  NEXT_PUBLIC_APP_ICON: process.env.NEXT_PUBLIC_APP_ICON || "/logos/logo.svg",
  NEXT_PUBLIC_APP_SPLASH_IMAGE:
    process.env.NEXT_PUBLIC_APP_SPLASH_IMAGE || "/logos/logo.svg",
  NEXT_PUBLIC_SPLASH_BACKGROUND_COLOR:
    process.env.NEXT_PUBLIC_SPLASH_BACKGROUND_COLOR || "#000000",
  NEXT_PUBLIC_APP_PRIMARY_CATEGORY:
    process.env.NEXT_PUBLIC_APP_PRIMARY_CATEGORY || "DeFi",
  NEXT_PUBLIC_APP_HERO_IMAGE:
    process.env.NEXT_PUBLIC_APP_HERO_IMAGE || "/logos/logo.svg",
  NEXT_PUBLIC_APP_TAGLINE:
    process.env.NEXT_PUBLIC_APP_TAGLINE || "Social Trading Made Simple",
  NEXT_PUBLIC_APP_OG_TITLE: process.env.NEXT_PUBLIC_APP_OG_TITLE,
  NEXT_PUBLIC_APP_OG_DESCRIPTION: process.env.NEXT_PUBLIC_APP_OG_DESCRIPTION,
  NEXT_PUBLIC_APP_OG_IMAGE: process.env.NEXT_PUBLIC_APP_OG_IMAGE,

  // Farcaster Account Association (for ownership verification)
  FARCASTER_HEADER: process.env.FARCASTER_HEADER,
  FARCASTER_PAYLOAD: process.env.FARCASTER_PAYLOAD,
  FARCASTER_SIGNATURE: process.env.FARCASTER_SIGNATURE,

  NEXTAUTH_URL: process.env.NEXTAUTH_URL || "http://localhost:3000",
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  DATABASE_URL: process.env.DATABASE_URL,
} as const;

// Type-safe environment variables
export type Env = typeof env;

// Validation function
export function validateEnv() {
  const required = ["NEXT_PUBLIC_API_URL", "NEXT_PUBLIC_APP_URL"];

  const optional = [
    "NEXT_PUBLIC_CDP_CLIENT_API_KEY", // Optional but recommended for MiniKit
    // Manifest configuration (recommended for Base Mini Apps)
    "NEXT_PUBLIC_URL",
    "NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME",
    "NEXT_PUBLIC_APP_SUBTITLE",
    "NEXT_PUBLIC_APP_DESCRIPTION",
    "NEXT_PUBLIC_APP_ICON",
    "NEXT_PUBLIC_APP_PRIMARY_CATEGORY",
    "NEXT_PUBLIC_APP_TAGLINE",
    // Farcaster account association (required for production)
    "FARCASTER_HEADER",
    "FARCASTER_PAYLOAD",
    "FARCASTER_SIGNATURE",
  ];

  for (const var_name of required) {
    if (!env[var_name as keyof Env]) {
      throw new Error(`Missing required environment variable: ${var_name}`);
    }
  }

  // Warn about missing optional variables
  for (const var_name of optional) {
    if (!env[var_name as keyof Env]) {
      console.warn(`Optional environment variable not set: ${var_name}`);
    }
  }
}
