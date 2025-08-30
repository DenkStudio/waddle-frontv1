// Environment configuration
export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  NEXT_PUBLIC_API_URL:
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
  NEXT_PUBLIC_APP_URL:
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  NEXT_PUBLIC_GOOGLE_ANALYTICS_ID: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID,
  NEXT_PUBLIC_CDP_CLIENT_API_KEY: process.env.NEXT_PUBLIC_CDP_CLIENT_API_KEY,
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
