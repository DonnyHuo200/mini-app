"use client";

import classNames from "classnames";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { formatUnits } from "viem";
import { useAccount, useChains } from "wagmi";

import { GET_ASSETS_ACTIVITIES_GRAPHQL } from "@/graphql/queries/assets";
import { useQuery } from "@apollo/client";
import { Card, Skeleton, Table } from "@radix-ui/themes";
import { formatAddress, formatNumber, restrictDecimals } from "@/lib";
import { dateTimeUTCFormat } from "@/lib/utils";
import { useSolvBtcStore } from "@/states";
import claim from "@/assets/images/claim.svg";
import NoData from "@/components/NoData";
import Pagination from "@/components/Pagination";
import redeem from "@/assets/images/redeem.svg";
import revoke from "@/assets/images/revoke.svg";
import sale from "@/assets/images/sale.svg";
import stake from "@/assets/images/stake.svg";
import transfer from "@/assets/images/transfer.svg";
import unstake from "@/assets/images/unstake.svg";

const ActivityList = ({
  activityType,
  productName,
  chainId
}: {
  activityType: string[];
  productName: string[];
  chainId: string[];
}) => {
  const { address } = useAccount();
  const chains = useChains();

  const [offset, setOffset] = useState(0);
  const [limit] = useState(5);

  const { data, refetch, previousData } = useQuery(
    GET_ASSETS_ACTIVITIES_GRAPHQL,
    {
      variables: {
        filter: {
          activityType,
          productName,
          chainId,
          address: address
        },
        pagination: {
          offset: offset * limit,
          limit: limit
        },
        sort: {
          field: "blockTimestamp",
          direction: "DESC"
        }
      },
      skip: !address || !activityType || !productName || !chainId
    }
  );

  const activitiesInfo = useMemo(() => {
    return data?.activities?.activitiesInfo;
  }, [data]);

  useEffect(() => {
    setOffset(0);
  }, [activityType, productName, chainId]);

  const getNetworkInfo = (chainId: string) => {
    return chains.find((item) => item.id === Number(chainId));
  };

  const { mode } = useSolvBtcStore();

  const getTransactionTypeImage = (transactionType: string) => {
    switch (transactionType) {
      case "Sale":
        return sale;
      case "Transfer":
        return transfer;
      case "Claim":
        return claim;
      case "Redeem":
        return redeem;
      case "Revoke":
        return revoke;
      case "Stake":
        return stake;
      case "Unstake":
        return unstake;
    }
  };

  const handlePageChange = (selectedItem: { selected: number }) => {
    setOffset(selectedItem.selected);
  };

  const totalCount = useMemo(() => {
    return (
      data?.activities?.totalCount ?? previousData?.activities?.totalCount ?? 0
    );
  }, [data, previousData]);

  return (
    <Card className="!p-0 mt-4">
      <div className="overflow-auto">
        <Table.Root className="min-w-[800px]">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Type</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Asset & ID</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>From</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>To</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Amount</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell className="text-right">
                Time (UTC)
              </Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            <>
              {!activitiesInfo ? (
                <>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Table.Row key={index} className="!align-middle">
                      <Table.Cell>
                        <Skeleton className="h-5 w-10" />
                      </Table.Cell>
                      <Table.Cell>
                        <Skeleton className="h-5 w-30" />
                      </Table.Cell>
                      <Table.Cell>
                        <Skeleton className="h-5 w-30" />
                      </Table.Cell>
                      <Table.Cell>
                        <Skeleton className="h-5 w-30" />
                      </Table.Cell>
                      <Table.Cell>
                        <Skeleton className="h-5 w-30" />
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex justify-end">
                          <Skeleton className="h-5 w-20" />
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </>
              ) : (
                <>
                  {activitiesInfo?.length > 0 ? (
                    activitiesInfo.map((item: any) => {
                      return (
                        <Table.Row key={item.id} className="!align-middle">
                          <Table.Cell>
                            <span
                              className={classNames(
                                "text-black rounded-full px-3 py-1 text-xs flex items-center gap-1 w-fit",
                                mode === "dark" ? "bg-white" : "bg-grayColor/10"
                              )}
                            >
                              <Image
                                src={getTransactionTypeImage(
                                  item.transactionType
                                )}
                                width={14}
                                height={14}
                                alt=""
                              />
                              <span>{item.transactionType}</span>
                            </span>
                          </Table.Cell>
                          <Table.Cell>
                            <div className="flex flex-col gap-1">
                              <span className="text-base font-MatterSQ-SemiBold">
                                {item.productName}
                              </span>
                              <span className="text-xs">#{item.tokenId}</span>
                            </div>
                          </Table.Cell>
                          <Table.Cell>
                            <a
                              target="_blank"
                              href={`${
                                getNetworkInfo(item.chainId)?.blockExplorers
                                  ?.default?.url
                              }/address/${item.fromAddress}`}
                              className="underline text-mainColor"
                            >
                              {formatAddress(item.fromAddress)}
                            </a>
                          </Table.Cell>
                          <Table.Cell>
                            <a
                              href={`${
                                getNetworkInfo(item.chainId)?.blockExplorers
                                  ?.default?.url
                              }/address/${item.fromAddress}`}
                              className="underline text-mainColor"
                            >
                              {formatAddress(item.toAddress)}
                            </a>
                          </Table.Cell>
                          <Table.Cell>
                            {formatNumber(
                              restrictDecimals(
                                formatUnits(item.amount, item.decimals),
                                6
                              )
                            )}
                          </Table.Cell>
                          <Table.Cell className="text-right">
                            {dateTimeUTCFormat(item.blockTimestamp * 1000)}
                          </Table.Cell>
                        </Table.Row>
                      );
                    })
                  ) : (
                    <Table.Row>
                      <Table.Cell colSpan={6}>
                        <NoData />
                      </Table.Cell>
                    </Table.Row>
                  )}
                </>
              )}
            </>
          </Table.Body>
        </Table.Root>
      </div>

      <Pagination
        pageCount={Math.ceil(totalCount / limit)}
        forcePage={offset}
        handlePageChange={handlePageChange}
      />
      <div className="h-[100px]"></div>
    </Card>
  );
};

export default ActivityList;
