"use client";

import { MiniKitContextProvider } from "@/providers/MiniKitContextProvider";
import { PrivyProvider } from "@privy-io/react-auth";
import { base } from "wagmi/chains";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId="cmevng2qk002pl40c10p7mw2k"
      config={{
        loginMethods: [
          "email",
          "google",
          "twitter",
          "discord",
          "github",
          "wallet",
        ],
        appearance: {
          theme: "light",
          accentColor: "#676FFF",
          logo: "/logos/logo.svg",
        },
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
        },
        externalWallets: {
          walletConnect: {
            enabled: true,
          },
          coinbaseWallet: {
            connectionOptions: "all",
          },
        },
        // Optimize for MiniKit environment
        defaultChain: base,
      }}
    >
      <MiniKitContextProvider>{children}</MiniKitContextProvider>
    </PrivyProvider>
  );
}
