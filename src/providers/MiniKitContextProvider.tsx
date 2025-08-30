'use client';
import { MiniKitProvider } from '@coinbase/onchainkit/minikit';
import { ReactNode } from 'react';
import { base } from 'wagmi/chains';
import { env } from '@/lib/env';

export function MiniKitContextProvider({ children }: { children: ReactNode }) {
  // Provide fallback if API key is not available
  const apiKey = env.NEXT_PUBLIC_CDP_CLIENT_API_KEY;
  
  if (!apiKey) {
    console.warn('NEXT_PUBLIC_CDP_CLIENT_API_KEY is not set. MiniKit functionality may be limited.');
    // Return children without MiniKit provider if no API key
    return <>{children}</>;
  }

  return (
    <MiniKitProvider apiKey={apiKey} chain={base}>
      {children}
    </MiniKitProvider>
  );
}