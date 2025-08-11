import { ReactNode } from "react";
import { Chain } from "viem";

import { MiniKitProvider as Provider } from "@coinbase/onchainkit/minikit";

const MiniKitProvider = ({
  children,
  chain
}: {
  children: ReactNode;
  chain: Chain;
}) => {
  return (
    <Provider
      apiKey={process.env.NEXT_PUBLIC_CDP_CLIENT_API_KEY}
      chain={chain}
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
    </Provider>
  );
};

export default MiniKitProvider;
