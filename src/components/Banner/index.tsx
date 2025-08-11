"use client";

import classNames from "classnames";

import { Card, Skeleton } from "@radix-ui/themes";
import { QueryBTCStats } from "@/graphql/queries/pools";
import { useQuery } from "@apollo/client";
import { truncateToDecimals } from "@/lib";
import { useSolvBtcStore } from "@/states";

const Banner = () => {
  const { data } = useQuery(QueryBTCStats);

  const { mode } = useSolvBtcStore();

  return (
    <Card className="!p-0 my-4">
      <div className="p-4 bg-[url('/solvbtc-h5-dark.png')] bg-contain bg-no-repeat bg-right">
        <div
          className={classNames(
            "text-[32px] font-Faculty-Glyphic",
            mode === "dark" ? "text-secondaryColor" : "text-black"
          )}
        >
          SolvBTC
        </div>
        <div
          className={classNames(
            "text-[12px]",
            mode === "dark" ? "text-secondaryColor" : "text-black"
          )}
        >
          A Bitcoin Reserve for Everyone
        </div>
        <div>
          <div className="text-[14px] text-gray-500 mt-2">
            SolvBTC in Circulation
          </div>
          {data?.btcStats?.totalSolvBtcAmount ? (
            <div className="text-[20px]">
              <span className="font-MatterSQ-Medium">
                {truncateToDecimals(data?.btcStats?.totalSolvBtcAmount)}
              </span>
              <span className="font-MatterSQ-Medium pl-1">SolvBTC</span>
            </div>
          ) : (
            <Skeleton loading className="w-40 h-6 mt-1"></Skeleton>
          )}
        </div>
      </div>
    </Card>
  );
};
export default Banner;
