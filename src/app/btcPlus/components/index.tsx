import classNames from "classnames";
import { useState } from "react";
import { useAccount, useChainId } from "wagmi";

import { Box, Card, Tabs } from "@radix-ui/themes";
import { useSolvBtcStore } from "@/states";
import { useQuery } from "@apollo/client";
import { YieldPoolSupportedChains } from "@/graphql/queries/solvbtc";
import { getBtcPoolInfoQuery } from "@/graphql/queries/pools";

import Deposit from "./deposit";
import Withdraw from "./withdraw";

const BTCPlus = () => {
  const { mode } = useSolvBtcStore();

  const [active, setActive] = useState("deposit");

  const currentChainId = useChainId();

  const { data: supportedChains } = useQuery(YieldPoolSupportedChains, {
    variables: {
      yieldType: "BTC+"
    }
  });

  const supportedChain = supportedChains?.yieldPoolSupportedChains?.find(
    (chain: { chainId: number }) => chain?.chainId === currentChainId
  );

  const { data: btcPoolInfo } = useQuery(getBtcPoolInfoQuery, {
    variables: {
      filter: {
        poolSlotInfoId: supportedChain?.poolSlotInfoId
      }
    },
    skip: !supportedChain?.poolSlotInfoId
  });

  return (
    <Card className="!p-6">
      <Tabs.Root value={active} onValueChange={setActive}>
        <Tabs.List className="flex !shadow-none">
          <Tabs.Trigger
            value="deposit"
            className={classNames(
              "w-full before:data-[state=active]:h-0 !rounded-full",
              {
                "!bg-white/10": mode === "dark" && active === "deposit",
                "!bg-black/10": mode === "light" && active === "deposit"
              }
            )}
          >
            <span className="text-[16px] font-MatterSQ-Medium ">Deposit</span>
          </Tabs.Trigger>
          <Tabs.Trigger
            value="withdraw"
            className={classNames(
              "w-full before:data-[state=active]:h-0 !rounded-full",
              {
                "!bg-white/10": mode === "dark" && active === "withdraw",
                "!bg-black/10": mode === "light" && active === "withdraw"
              }
            )}
          >
            <span className="text-[16px] font-MatterSQ-Medium">Withdraw</span>
          </Tabs.Trigger>
        </Tabs.List>

        <Box pt="3">
          <Tabs.Content value="deposit">
            <Deposit btcPoolInfo={btcPoolInfo} />
          </Tabs.Content>
          <Tabs.Content value="withdraw">
            <Withdraw btcPoolInfo={btcPoolInfo} />
          </Tabs.Content>
        </Box>
      </Tabs.Root>
    </Card>
  );
};

export default BTCPlus;
