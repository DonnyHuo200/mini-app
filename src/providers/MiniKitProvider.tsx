"use client";

import { ReactNode } from "react";
import { WagmiProvider } from "wagmi";
import { http, createConfig, createStorage, cookieStorage } from "wagmi";
import { base, sepolia } from "wagmi/chains";
import { metaMask } from "wagmi/connectors";

import { ApolloProvider } from "@apollo/client";
import { MiniKitProvider } from "@coinbase/onchainkit/minikit";
import { farcasterMiniApp as miniAppConnector } from "@farcaster/miniapp-wagmi-connector";
import { Theme } from "@radix-ui/themes";
import { useSolvBtcStore, useStore } from "@/states";
import client from "@/graphql/clientsFactory";
import Header from "@/components/Header";
// import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
// import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import Notice from "@/components/Notice";
import TradingDialog from "@/components/TradingDialog";
import TradingResult from "@/components/TradingResult";

import "@rainbow-me/rainbowkit/styles.css";

function ThemeProvider({ children }: { children: ReactNode }) {
  const { mode } = useSolvBtcStore();

  return (
    <Theme appearance={mode as "light" | "dark" | "inherit" | undefined}>
      {children}
    </Theme>
  );
}

export function MiniKitContextProvider({ children }: { children: ReactNode }) {
  const config =
    process.env.NEXT_PUBLIC_ENV === "dev"
      ? createConfig({
          chains: [sepolia],
          transports: {
            [sepolia.id]: http()
          },
          storage: createStorage({ storage: cookieStorage }),
          connectors: [metaMask()],
          ssr: true
        })
      : createConfig({
          chains: [base],
          transports: {
            [base.id]: http()
          },
          connectors: [miniAppConnector()],
          storage: createStorage({ storage: cookieStorage })
        });

  const { noticeOpen } = useStore();

  return (
    <ThemeProvider>
      <ApolloProvider client={client}>
        <WagmiProvider config={config}>
          {/* <RainbowKitProvider modalSize="compact" locale={"en"}> */}
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
            <Header />
            <div className="pt-[50px]">
              {noticeOpen ? <Notice /> : null}
              {children}
            </div>
            <TradingDialog />
            <TradingResult />
          </MiniKitProvider>
          {/* </RainbowKitProvider> */}
        </WagmiProvider>
      </ApolloProvider>
    </ThemeProvider>
  );
}
