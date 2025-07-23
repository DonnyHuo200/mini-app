"use client";

import "@rainbow-me/rainbowkit/styles.css";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { MiniKitProvider } from "@coinbase/onchainkit/minikit";
import { ReactNode } from "react";
import { base } from "wagmi/chains";
import { http, createConfig } from "wagmi";
import { farcasterMiniApp as miniAppConnector } from "@farcaster/miniapp-wagmi-connector";

export function MiniKitContextProvider({ children }: { children: ReactNode }) {
  const config = createConfig({
    chains: [base],
    transports: {
      [base.id]: http()
    },
    connectors: [miniAppConnector()],
    ssr: true
  });

  const queryClient = new QueryClient();

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider modalSize="compact" locale={"en"}>
          <MiniKitProvider
            apiKey={process.env.NEXT_PUBLIC_CDP_CLIENT_API_KEY}
            chain={base}
            config={{
              appearance: {
                mode: "auto",
                theme: "snake",
                name: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME,
                logo: process.env.NEXT_PUBLIC_APP_ICON
              }
            }}
          >
            {children}
          </MiniKitProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
