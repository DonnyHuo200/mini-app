"use client";
import "@rainbow-me/rainbowkit/styles.css";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

import { MiniKitProvider } from "@coinbase/onchainkit/minikit";
import { ReactNode } from "react";
import { base } from "wagmi/chains";

import { http, createConfig } from "wagmi";
// import {
//   coinbaseWallet,
//   metaMaskWallet,
//   walletConnectWallet
// } from "@rainbow-me/rainbowkit/wallets";
import { farcasterMiniApp as miniAppConnector } from "@farcaster/miniapp-wagmi-connector";

export function MiniKitContextProvider({ children }: { children: ReactNode }) {
  // const config = getDefaultConfig({
  //   appName: "Solv App",
  //   projectId: "a22a140d64a44539cf4c025ee97cf1c2",
  //   chains: [base],
  //   wallets: [
  //     {
  //       groupName: "Popular",
  //       wallets: [coinbaseWallet, metaMaskWallet, walletConnectWallet]
  //     }
  //   ],
  //   ssr: true // If your dApp uses server side rendering (SSR)
  // });

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
