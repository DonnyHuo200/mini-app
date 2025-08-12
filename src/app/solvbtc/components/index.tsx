import {
  getBtcPoolInfoQuery,
  getPoolsQueryForStakeDetails,
  QuerySupportedChainsM
} from "@/graphql/queries/pools";
import classNames from "classnames";
import Image from "next/image";
import { useMemo, useState } from "react";
import { useChainId } from "wagmi";

import { Box, Card, Skeleton, Tabs } from "@radix-ui/themes";
import { useQuery } from "@apollo/client";
import { GetRedemptionFeeRate, getSolvBTCFee } from "@/graphql/queries/solvbtc";
import { useSolvBtcStore } from "@/states";
import star from "@/assets/images/star.svg";

import Deposit from "./deposit";
import Detail from "./detail";
import Withdraw from "./withdraw";

const SolvBtc = () => {
  const { mode } = useSolvBtcStore();

  // supported chains
  const { data: supportedChains } = useQuery(QuerySupportedChainsM);

  const currentChainId = useChainId();

  const currentChainInfo = useMemo(() => {
    return supportedChains?.supportedChainsM.filter(
      (item: { chainId: number }) => item.chainId == currentChainId
    )?.[0];
  }, [currentChainId, supportedChains]);

  // pool info
  const { data: btcPoolInfo } = useQuery(getBtcPoolInfoQuery, {
    variables: {
      filter: {
        poolSlotInfoId:
          currentChainInfo?.idAndCurrency[
            currentChainInfo?.idAndCurrency?.length - 1
          ]?.poolSlotInfoId,
        phase: 2
      }
    },
    skip: !currentChainInfo?.idAndCurrency[
      currentChainInfo?.idAndCurrency?.length - 1
    ]?.poolSlotInfoId
  });

  // solv fee
  const { data: solvBTCFee } = useQuery(getSolvBTCFee, {
    variables: {
      poolId: btcPoolInfo?.btcPoolInfo?.poolInfo?.poolOrderInfo?.poolId,
      symbol: btcPoolInfo?.btcPoolInfo?.poolInfo?.currencyInfo?.symbol
    },
    skip: !btcPoolInfo?.btcPoolInfo?.poolInfo?.poolOrderInfo?.poolId
  });

  // redemption fee rate
  const { data: redemptionFeeRate } = useQuery(GetRedemptionFeeRate, {
    variables: {
      chainId: currentChainId,
      poolId: btcPoolInfo?.btcPoolInfo?.poolInfo?.poolOrderInfo?.poolId
    },
    skip: !btcPoolInfo?.btcPoolInfo?.poolInfo?.poolOrderInfo?.poolId
  });

  // details
  const { data: details } = useQuery(getPoolsQueryForStakeDetails, {
    variables: {
      filter: {
        poolSlotInfoId: currentChainInfo?.idAndCurrency[0]?.poolSlotInfoId
      },
      pagination: {},
      sort: {}
    },
    skip: !currentChainInfo?.idAndCurrency[0]?.poolSlotInfoId
  });

  const solvBTCFeeNumber = useMemo(() => {
    return 1 - Number(solvBTCFee?.solvbtcFee);
  }, [solvBTCFee]);

  const redemptionFeeRateNumber = useMemo(() => {
    return 1 - Number(redemptionFeeRate?.getRedemptionFeeRate);
  }, [redemptionFeeRate]);

  const [activeTab, setActiveTab] = useState("Deposit");

  return (
    <Card className="my-4 !p-4">
      <div className="flex justify-between items-center text-[12px] mb-4">
        {btcPoolInfo?.btcPoolInfo?.poolInfo?.pointRatio ? (
          <div className="bg-black px-2 py-[1px] rounded-full flex items-center gap-[2px]">
            <Image src={star} alt="star" width={10} height={10} />
            <span className="font-Fusion-Pixel font-bold text-white">
              {btcPoolInfo?.btcPoolInfo?.poolInfo?.pointRatio}X/BTC
            </span>
          </div>
        ) : (
          <Skeleton loading className="w-16 h-4 mt-1"></Skeleton>
        )}

        {btcPoolInfo?.btcPoolInfo && solvBTCFeeNumber ? (
          <div>
            {activeTab === "Deposit" && (
              <span>
                1.00 {btcPoolInfo?.btcPoolInfo?.poolInfo?.currencyInfo?.symbol}{" "}
                = {solvBTCFeeNumber}{" "}
                {btcPoolInfo?.btcPoolInfo?.wrappedTokenInfo?.symbol}
              </span>
            )}
            {activeTab === "Withdraw" && (
              <span>
                1.00 {btcPoolInfo?.btcPoolInfo?.wrappedTokenInfo?.symbol} ={" "}
                {`${redemptionFeeRateNumber}.00`}{" "}
                {btcPoolInfo?.btcPoolInfo?.poolInfo?.currencyInfo?.symbol}
              </span>
            )}
          </div>
        ) : (
          <Skeleton loading className="w-32 h-4 mt-1"></Skeleton>
        )}
      </div>
      <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
        <Tabs.List className="flex items-center !justify-around !shadow-none">
          <Tabs.Trigger
            value="Deposit"
            className={classNames("w-full", {
              "before:data-[state=active]:bg-white": mode === "dark",
              "before:data-[state=active]:bg-black": mode === "light"
            })}
          >
            <span className="text-[16px] font-MatterSQ-Medium">Deposit</span>
          </Tabs.Trigger>
          <Tabs.Trigger
            value="Withdraw"
            className={classNames("w-full", {
              "before:data-[state=active]:bg-white": mode === "dark",
              "before:data-[state=active]:bg-black": mode === "light"
            })}
          >
            <span className="text-[16px] font-MatterSQ-Medium">Withdraw</span>
          </Tabs.Trigger>
          <Tabs.Trigger
            value="Details"
            className={classNames("w-full", {
              "before:data-[state=active]:bg-white": mode === "dark",
              "before:data-[state=active]:bg-black": mode === "light"
            })}
          >
            <span className="text-[16px] font-MatterSQ-Medium">Details</span>
          </Tabs.Trigger>
        </Tabs.List>

        <Box pt="3">
          <Tabs.Content value="Deposit">
            <Deposit
              solvBTCFee={solvBTCFee?.solvbtcFee}
              btcPoolInfo={btcPoolInfo}
            />
          </Tabs.Content>

          <Tabs.Content value="Withdraw">
            <Withdraw
              btcPoolInfo={btcPoolInfo}
              redemptionFeeRate={redemptionFeeRate?.getRedemptionFeeRate}
            />
          </Tabs.Content>

          <Tabs.Content value="Details">
            <Detail
              details={details?.pools?.poolsInfo[0]}
              tokenAddress={
                btcPoolInfo?.btcPoolInfo?.wrappedTokenInfo?.tokenAddress
              }
            />
          </Tabs.Content>
        </Box>
      </Tabs.Root>
    </Card>
  );
};

export default SolvBtc;
