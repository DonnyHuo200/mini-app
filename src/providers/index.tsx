"use client";

import { ReactNode } from "react";
import { WagmiProvider } from "wagmi";
import { http, createConfig, createStorage, cookieStorage } from "wagmi";
import { base, sepolia } from "wagmi/chains";
import { metaMask } from "wagmi/connectors";

import { ApolloProvider } from "@apollo/client";
import { farcasterMiniApp as miniAppConnector } from "@farcaster/miniapp-wagmi-connector";
import client from "@/graphql/clientsFactory";
// import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
// import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

import BodyProvider from "./BodyProvider";
import MiniKitProvider from "./MiniKitProvider";
import ThemeProvider from "./ThemeProvider";

import "@rainbow-me/rainbowkit/styles.css";

const Provider = ({ children }: { children: ReactNode }) => {
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

  return (
    <ThemeProvider>
      <ApolloProvider client={client}>
        <WagmiProvider config={config}>
          {/* <RainbowKitProvider modalSize="compact" locale={"en"}> */}
          <MiniKitProvider chain={base}>
            <BodyProvider>{children}</BodyProvider>
          </MiniKitProvider>
          {/* </RainbowKitProvider> */}
        </WagmiProvider>
      </ApolloProvider>
    </ThemeProvider>
  );
};

export { Provider };
