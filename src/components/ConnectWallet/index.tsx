"use client";

import { Button } from "@radix-ui/themes";
import { useEffect } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";

export const ConnectWallet = () => {
  const { isConnected, address } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  useEffect(() => {
    connect({ connector: connectors[0] });
  }, [connect, connectors]);

  return (
    <div>
      {isConnected ? (
        <>
          <div>{`You're connected!`}</div>
          <div>Address: {address}</div>
          <Button onClick={() => disconnect()}>disconnect</Button>
        </>
      ) : (
        <>
          {connectors &&
            connect &&
            connectors.map((connector) => (
              <Button
                key={connector.uid}
                onClick={() => connect({ connector })}
              >
                {connector.name}
              </Button>
            ))}
        </>
      )}
    </div>
  );
};
