"use client";

import { useEffect, useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";

import { Button, Popover } from "@radix-ui/themes";
import { sdk } from "@farcaster/miniapp-sdk";
import { formatAddress } from "@/lib";
import { ChevronDownIcon } from "@radix-ui/react-icons";

interface UserInfo {
  user: {
    displayName?: string;
  };
}

export const ConnectWallet = () => {
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const getInfo = async () => {
    const info: UserInfo = await sdk.context;
    setUserInfo(info);
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
        <Popover.Root>
          <Popover.Trigger>
            <div className="flex items-center gap-2">
              <div className="border border-solid border-gray-500 rounded-full text-[12px] px-2 py-1 flex items-center gap-1">
                <span>{address ? formatAddress(address, 6, 4) : "--"}</span>
                <ChevronDownIcon width={12} height={12} />
              </div>
            </div>
          </Popover.Trigger>
          <Popover.Content>
            <div className="text-sm mb-2">
              {userInfo?.user?.displayName && (
                <div>Name: {userInfo?.user?.displayName || "--"}</div>
              )}
            </div>
            <Button
              className="!bg-mainColor !rounded-2xl"
              onClick={() => disconnect()}
            >
              Disconnect
            </Button>
          </Popover.Content>
        </Popover.Root>
      ) : (
        <>
          {connectors && connect && (
            <div
              className="bg-transparent rounded-2xl border border-solid border-gray-500 px-2 py-1 flex items-center"
              onClick={() => connect({ connector: connectors[0] })}
            >
              <span className="font-MatterSQ-Regular !text-[12px]">
                Connect Wallet
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
};
