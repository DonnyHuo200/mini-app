"use client";

import classNames from "classnames";
import Image from "next/image";
import { useMemo } from "react";

import { QueryBtcPlusAllocations } from "@/graphql/queries/btcplus";
import { dateUTCFormat, multipliedBy } from "@/lib/utils";
import { useQuery } from "@apollo/client";
import { Card, Flex, Skeleton } from "@radix-ui/themes";
import { GET_TOKEN_ICON } from "@/lib";
import { useBtcPlusStore, useSolvBtcStore } from "@/states";
import NoData from "@/components/NoData";

import { AllocationsCharts } from "./allocationsCharts";

const Demo = () => {
  const { mode } = useSolvBtcStore();

  const { data: btcPlusAllocations, loading } = useQuery(
    QueryBtcPlusAllocations
  );

  const allocations = useMemo(() => {
    return btcPlusAllocations?.btcPlusAllocations.allocations;
  }, [btcPlusAllocations]);

  const { time } = useBtcPlusStore();

  return (
    <Card className="!p-6 my-4">
      <div className="text-[20px] font-MatterSQ-Medium">
        Current Allocations
      </div>
      <div className="font-MatterSQ-Regular text-xs leading-[16px] text-gray flex justify-end">
        <div>Last Update</div>
        <span className="ml-[4px]">
          {dateUTCFormat(Number(time) * 1000, "DD/MM/YYYY")}
        </span>
      </div>
      <Flex justify="between" className="flex-1 flex-col items-stretch mt-8">
        <Flex justify="center" className="h-[auto] flex-1 text-sm">
          <div className="h-[auto] w-full font-MatterSQ-Regular">
            <div className="flex items-center justify-between mb-2 p-4 rounded-xl bg-grayColor/10">
              <div>Holdings</div>
              <div>Percentage</div>
            </div>
            {loading ? (
              <>
                {["1", "2"].map((item) => (
                  <Card
                    key={item}
                    className="!flex !items-center !justify-between mb-2"
                  >
                    <Flex justify="start">
                      <Skeleton width="6rem" height="1.25rem"></Skeleton>
                    </Flex>
                    <Flex justify="end">
                      <Skeleton width="4rem" height="1rem"></Skeleton>
                    </Flex>
                  </Card>
                ))}
              </>
            ) : (
              <>
                {allocations.length > 0 ? (
                  <>
                    {allocations.map(
                      (item: { assetName: string; percentage: number }) => (
                        <Card
                          key={item.assetName}
                          className="!flex !items-center !justify-between mb-2"
                        >
                          <div className="flex items-center">
                            <Image
                              width={20}
                              height={20}
                              src={GET_TOKEN_ICON(item.assetName || "")}
                              alt={item.assetName || ""}
                            ></Image>
                            <span className="ml-[0.5rem]">
                              {item.assetName}
                            </span>
                          </div>
                          <div>
                            {multipliedBy(item.percentage || 0, "100")}%
                          </div>
                        </Card>
                      )
                    )}
                  </>
                ) : (
                  <NoData className="!h-[14rem]"></NoData>
                )}
              </>
            )}
          </div>
        </Flex>
        <Flex justify="center" className="h-[auto] w-full">
          {loading ? (
            <Flex justify="center" className="size-full">
              <Skeleton
                className={classNames("!h-[12rem] !w-[12rem] !rounded-full")}
              ></Skeleton>
            </Flex>
          ) : (
            <Flex justify="center" className="relative size-full">
              <AllocationsCharts
                data={btcPlusAllocations?.btcPlusAllocations.allocations}
                tvl={btcPlusAllocations?.btcPlusAllocations.tvl}
              ></AllocationsCharts>
            </Flex>
          )}
        </Flex>
      </Flex>
    </Card>
  );
};

export default Demo;
