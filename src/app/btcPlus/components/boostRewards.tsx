import {
  beautyAmount,
  dateUTCFormat,
  thousandsValueFormat,
  toFixed
} from "@/lib/utils";
import Image from "next/image";
import { useAccount } from "wagmi";

import { Button, Card, Popover, Skeleton } from "@radix-ui/themes";
import { QueryBtcPlusRewardByAddress } from "@/graphql/queries/btcplus";
import { useQuery } from "@apollo/client";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { GET_TOKEN_ICON } from "@/lib";
import { useBtcPlusStore } from "@/states";

const BoostRewards = () => {
  const { address } = useAccount();

  const { data } = useQuery(QueryBtcPlusRewardByAddress, {
    variables: {
      address: address,
      stageNo: 1
    },
    skip: !address
  });

  const { btcPlusStats } = useBtcPlusStore();

  return (
    <Card className="!p-6 my-4">
      <Card className="!p-6">
        <div className="text-[20px] font-MatterSQ-Medium">Boost Rewards</div>
        <div className="flex justify-end mt-4">
          {!btcPlusStats ? (
            <div className="flex flex-col items-end gap-2">
              <Skeleton className="w-60 h-6" />
              <Skeleton className="w-40 h-6" />
            </div>
          ) : (
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-1">
                <Image
                  src={GET_TOKEN_ICON("SOLV")}
                  alt="btcplus-boost-rewards"
                  width={28}
                  height={28}
                />
                <span className="text-[24px] font-MatterSQ-Medium">
                  ${" "}
                  {beautyAmount({
                    value: btcPlusStats?.totalRewards || 0,
                    poly: false
                  })}{" "}
                  SOLV
                </span>
              </div>
              <div className="text-base text-grayColor flex items-center gap-1">
                <span>
                  {dateUTCFormat(
                    Number(btcPlusStats?.startDate) + "" != "NaN"
                      ? Number(btcPlusStats?.startDate) * 1000
                      : new Date(
                          btcPlusStats?.startDate + " 08:00:00"
                        ).getTime(),
                    "DD/MM/YYYY"
                  )}
                </span>
                <span>-</span>
                <span>
                  {dateUTCFormat(
                    Number(btcPlusStats?.endDate) + "" != "NaN"
                      ? Number(btcPlusStats?.endDate) * 1000
                      : new Date(btcPlusStats?.endDate + " 08:00:00").getTime(),
                    "DD/MM/YYYY"
                  )}
                </span>
              </div>
            </div>
          )}
        </div>
      </Card>
      <Card className="!p-6 mt-4">
        <div className="text-[20px] font-MatterSQ-Medium mb-6">Portfolio</div>
        <div className="flex flex-col gap-4 text-sm">
          <div className="flex justify-between border-b border-solid border-grayColor/20 py-2">
            <span className="text-grayColor">Your Balance</span>
            {data?.btcPlusRewardByAddress ? (
              <div className="flex flex-col gap-1">
                <div className="text-[18px] font-MatterSQ-Medium text-right">
                  $
                  {beautyAmount({
                    value: data?.btcPlusRewardByAddress?.balanceUSD || 0,
                    fixed: 2
                  })}
                </div>
                <div className="text-base text-grayColor font-MatterSQ-Medium text-right">
                  {thousandsValueFormat(
                    toFixed(data?.btcPlusRewardByAddress?.balance || 0, 1, 2)
                  )}{" "}
                  BTC+
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-1 items-end">
                <Skeleton className="w-32 h-4" />
                <Skeleton className="w-20 h-4" />
              </div>
            )}
          </div>
          <div className="flex justify-between items-start border-b border-solid border-grayColor/20 py-2">
            <Popover.Root>
              <Popover.Trigger>
                <div className="flex items-center gap-1">
                  <span className="text-grayColor">Your Est.Rewards</span>
                  <InfoCircledIcon className="w-3 h-3" color="gray" />
                </div>
              </Popover.Trigger>
              <Popover.Content
                side="top"
                align="center"
                className="!max-w-[300px]"
              >
                <div className="text-sm">
                  <p>
                    Your estimated rewards, shown in USD and updated daily,
                    reflect Solv tokens earned from BTC+ Vault participation.
                    The final token amount depends on the Solv price at the end
                    of the 3-month reward period. Rewards are shared from a
                    fixed prize pool.
                  </p>
                  <a
                    href="https://docs.solv.finance/key-products/btc+/reward-distribution"
                    target="_blank"
                    className="block underline"
                    rel="noreferrer"
                  >
                    Learn More
                  </a>
                </div>
              </Popover.Content>
            </Popover.Root>

            {data?.btcPlusRewardByAddress ? (
              <div className="flex flex-col gap-2">
                <div className="text-[18px] font-MatterSQ-Medium">
                  {thousandsValueFormat(
                    toFixed(
                      data?.btcPlusRewardByAddress?.estimatedReward || 0,
                      1,
                      2
                    )
                  )}{" "}
                  SOLV
                </div>
                <div className="flex justify-end">
                  <Popover.Root>
                    <Popover.Trigger>
                      <Button className="!h-6 !rounded-full !bg-grayColor/10 !text-grayColor">
                        <span className="text-sm">Claim</span>
                      </Button>
                    </Popover.Trigger>
                    <Popover.Content
                      side="top"
                      align="center"
                      className="!max-w-[300px]"
                    >
                      <p className="text-sm">
                        Claim your $SOLV Boost Rewards after the end of BTC+
                        Phase 1 campaign.
                      </p>
                    </Popover.Content>
                  </Popover.Root>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-1 items-end">
                <Skeleton className="w-32 h-4" />
                <Skeleton className="w-20 h-4" />
              </div>
            )}
          </div>
          <div className="flex justify-between border-b border-solid border-grayColor/20 py-2">
            <Popover.Root>
              <Popover.Trigger>
                <div className="flex items-center gap-1">
                  <span className="text-grayColor">Your Reward Power</span>
                  <InfoCircledIcon className="w-3 h-3" color="gray" />
                </div>
              </Popover.Trigger>
              <Popover.Content
                side="top"
                align="center"
                className="!max-w-[300px]"
              >
                <div className="text-sm">
                  <p>
                    Your Reward Power represents your accumulated points based
                    on BTC+ Vault Boost Rewards participation. Higher Reward
                    Power increases your share of the rewards pool. Points are
                    updated daily to reflect your contributions.
                  </p>
                  <a
                    href="https://docs.solv.finance/key-products/btc+/reward-distribution"
                    target="_blank"
                    className="underline"
                    rel="noreferrer"
                  >
                    Learn More
                  </a>
                </div>
              </Popover.Content>
            </Popover.Root>
            {data?.btcPlusRewardByAddress ? (
              <div className="text-[18px] font-MatterSQ-Medium">
                {thousandsValueFormat(
                  toFixed(data?.btcPlusRewardByAddress?.rewardPower || 0, 0)
                )}
              </div>
            ) : (
              <Skeleton className="w-20 h-4" />
            )}
          </div>
          <div className="flex justify-between items-start">
            <span className="text-grayColor">Total Reward Power</span>
            {data?.btcPlusRewardByAddress ? (
              <div className="text-[18px] font-MatterSQ-Medium">
                {thousandsValueFormat(
                  toFixed(
                    data?.btcPlusRewardByAddress?.currentTotalRewardPower || 0,
                    0
                  )
                )}
              </div>
            ) : (
              <Skeleton className="w-20 h-4" />
            )}
          </div>
        </div>
      </Card>
    </Card>
  );
};

export default BoostRewards;
