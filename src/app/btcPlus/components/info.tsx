import Image from "next/image";
import { useEffect } from "react";

import { InfoCircledIcon } from "@radix-ui/react-icons";
import { Card, Popover, Skeleton } from "@radix-ui/themes";
import { QueryBtcPlusStats } from "@/graphql/queries/btcplus";
import { useQuery } from "@apollo/client";
import { dateUTCFormat } from "@/lib/utils";
import { useBtcPlusStore } from "@/states";
import Rick from "@/assets/images/rick.svg";

const Info = () => {
  const { data: btcPlusState, loading: btcPlusLoading } = useQuery(
    QueryBtcPlusStats,
    {
      variables: {
        stageNo: 1
      }
    }
  );

  const { updateTime, updateBtcPlusStats } = useBtcPlusStore();

  useEffect(() => {
    updateTime(btcPlusState?.btcPlusStats?.lastUpdatedTime || 0);
    updateBtcPlusStats(btcPlusState?.btcPlusStats);
  }, [btcPlusState]);

  return (
    <Card className="my-3 !p-6">
      <div className="text-[56px] font-Faculty-Glyphic">BTC+</div>
      <div className="text-[24px]">One-stop to Grow Your ₿</div>

      <Card className="mt-8 !flex !flex-col !gap-[38px]">
        {btcPlusState?.btcPlusStats?.rewardApy ? (
          <div className="text-[28px] flex items-start gap-1">
            <span className="font-MatterSQ-SemiBold">5% + </span>
            <span className="font-MatterSQ-SemiBold text-[#A7AAF9]">
              {Math.floor(btcPlusState?.btcPlusStats?.rewardApy || 0)}%
            </span>
            <Image
              src={Rick}
              className="mt-2"
              alt="btcplus-reward"
              width={14}
              height={14}
            />
          </div>
        ) : (
          <Skeleton className="h-10 w-40" loading />
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="text-[18px]">Target APY</span>
            <Popover.Root>
              <Popover.Trigger>
                <InfoCircledIcon width={14} height={14} />
              </Popover.Trigger>
              <Popover.Content side="top" align="center">
                <div className="text-[13px] w-[300px]">
                  Est. APY includes base yield from vault strategies and boosted
                  yield from $SOLV incentives, distributed at the end of the
                  campaign.
                </div>
              </Popover.Content>
            </Popover.Root>
          </div>

          {btcPlusLoading ? (
            <Skeleton className="h-6 w-40" loading />
          ) : (
            <div className="text-xs">
              Last Update:{" "}
              {dateUTCFormat(
                (btcPlusState?.btcPlusStats.lastUpdatedTime || 0) * 1000,
                "DD/MM/YYYY"
              )}
            </div>
          )}
        </div>
      </Card>

      <Card className="mt-4 !flex !flex-col !gap-[38px]">
        {btcPlusLoading ? (
          <Skeleton className="h-10 w-full" loading />
        ) : (
          <div className="text-[28px] font-MatterSQ-SemiBold">
            {(Number(btcPlusState?.btcPlusStats?.tvl) || 0).toFixed(2)} BTC /{" "}
            {(Number(btcPlusState?.btcPlusStats?.cap) || 0).toFixed(2)} BTC
          </div>
        )}

        <div className="flex items-end justify-between">
          <span className="text-[18px]">TVL</span>
          {btcPlusLoading ? (
            <Skeleton className="h-6 w-40" loading />
          ) : (
            <div className="text-xs">
              Last Update:{" "}
              {dateUTCFormat(
                (btcPlusState?.btcPlusStats.lastUpdatedTime || 0) * 1000,
                "DD/MM/YYYY"
              )}
            </div>
          )}
        </div>
      </Card>
    </Card>
  );
};

export default Info;
