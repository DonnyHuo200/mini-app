"use client";

import { Button } from "@radix-ui/themes";
import { useEffect } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";

import { sdk } from "@farcaster/miniapp-sdk";

export const ConnectWallet = () => {
  const getInfo = async () => {
    const info = await sdk.context;
    console.log("info", info);
    return info;
  };

  useEffect(() => {
    getInfo();
  }, []);

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
