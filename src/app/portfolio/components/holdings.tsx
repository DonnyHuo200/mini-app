"use client";

import {
  formatNumber,
  GET_NETWORK_ICON,
  GET_TOKEN_ICON,
  restrictDecimals
} from "@/lib";
import {
  formatNumber as formatThousands,
  getCurrentTimestamp,
  isGreaterThanOrEqualTo
} from "@/lib/utils";
import classNames from "classnames";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { formatUnits } from "viem";
import { useAccount, useChainId, useChains } from "wagmi";

import { GetWrappedAssetsQuery } from "@/graphql/queries/wrapped-token";
import { useQuery } from "@apollo/client";
import { Button, Card, Skeleton } from "@radix-ui/themes";
import MateMask from "@/assets/images/metaMask.svg";
import NoData from "@/components/NoData";
import Pagination from "@/components/Pagination";
import useAddTokenButton from "@/hooks/useAddToken";

import WithdrawDialog from "./withdrawDialog";

const Holdings = () => {
  const { address } = useAccount();

  const currentChainId = useChainId();

  const { data, refetch, previousData } = useQuery(GetWrappedAssetsQuery, {
    variables: {
      filter: {
        holder: address
      },
      pagination: {
        offset: 0,
        limit: 5
      },
      sort: {
        field: "mintTime",
        direction: "DESC"
      }
    },
    skip: !address
  });

  const wrappedAssets = useMemo(
    () => data?.wrappedAssets?.wrappedAssets,
    [data]
  );

  const chains = useChains();

  const getNetworkInfo = (chainId: string) => {
    const currentChain = chains.find((chain) => chain.id === Number(chainId));

    return {
      name: currentChain?.name,
      icon: GET_NETWORK_ICON(currentChain?.name?.toLowerCase() ?? "1")
    };
  };

  const { addToken } = useAddTokenButton();

  const router = useRouter();

  const [offset, setOffset] = useState(0);

  const [limit] = useState(5);

  const totalCount = useMemo(() => {
    return (
      data?.wrappedAssets?.totalCount ??
      previousData?.wrappedAssets?.totalCount ??
      0
    );
  }, [data, previousData]);

  const handlePageChange = (selectedItem: { selected: number }) => {
    setOffset(selectedItem.selected);
  };

  useEffect(() => {
    refetch();
  }, [offset]);

  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<any>(null);

  return (
    <Card className="!p-6">
      <div className=" flex items-center justify-between">
        <span className="text-2xl font-MatterSQ-Medium">My Holdings</span>
        <div
          className="text-sm text-primaryColor border font-MatterSQ-Medium border-primaryColor rounded-full px-3 py-1"
          onClick={() => router.push("/")}
        >
          Earn with BTC+!
        </div>
      </div>
      {!wrappedAssets ? (
        <>
          {[1, 2, 3, 4].map((item) => {
            return (
              <Card key={item} className="text-sm mt-4 !py-4 ">
                <Skeleton className="w-full h-[20px] mt-2" />
                <Skeleton className="w-full h-[20px] mt-4" />
                <Skeleton className="w-full h-[20px] mt-4" />
                <Skeleton className="w-full h-[20px] mt-4" />
                <Skeleton className="w-full h-[20px] mt-4" />
              </Card>
            );
          })}
        </>
      ) : (
        <div>
          {wrappedAssets?.length > 0 ? (
            wrappedAssets?.map((asset: any, index: number) => (
              <Card key={index} className="!p-4 mt-4 text-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Image
                      src={GET_TOKEN_ICON(asset.symbol)}
                      alt={asset.symbol}
                      width={20}
                      height={20}
                    />
                    <span>{asset.symbol}</span>
                  </div>
                  <div
                    className="flex items-center gap-1 cursor-pointer"
                    onClick={() => {
                      addToken({
                        address: asset.tokenAddress,
                        symbol: asset.symbol,
                        decimals: asset.decimals
                      });
                    }}
                  >
                    <Image
                      src={MateMask}
                      alt={asset.symbol}
                      width={14}
                      height={14}
                    />
                    <span className="text-xs">{asset.symbol}</span>
                  </div>
                </div>

                <div className="flex items-center gap-16 mt-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-grayColor text-xs">Network</span>
                    <div className="flex items-center gap-1">
                      <Image
                        src={getNetworkInfo(asset.chainId)?.icon}
                        alt="network"
                        width={16}
                        height={16}
                        className="rounded-full"
                      />

                      <span>{getNetworkInfo(asset.chainId)?.name}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-grayColor text-xs">Amount</span>
                    <div>
                      {formatNumber(
                        restrictDecimals(
                          formatUnits(asset.balance, asset.decimals),
                          6
                        )
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-grayColor text-xs">Value</div>
                  <div className="flex items-center gap-1">
                    <span>
                      {formatNumber(
                        restrictDecimals(
                          Number(formatUnits(asset.balance, asset.decimals)) *
                            Number(
                              formatUnits(asset.nav, asset.currencyDecimals)
                            ),
                          6
                        )
                      )}{" "}
                      BTC
                    </span>

                    <span className="text-xs text-grayColor">
                      ${formatThousands(asset?.usdValue, 2)}
                    </span>
                  </div>
                </div>

                <div className="mt-4">
                  {asset?.chainId === currentChainId ? (
                    <>
                      {(asset.isYieldPool ||
                        asset.symbol?.toLocaleLowerCase() == "xsolv") &&
                      asset.yieldType != "BTC+" ? (
                        <Button
                          className="!w-full !mt-4 !rounded-full !h-[40px]"
                          disabled
                        >
                          <span className="text-base">
                            Manage on Solv.Finance
                          </span>
                        </Button>
                      ) : (
                        <Button
                          className={classNames(
                            "!w-full !mt-4 !rounded-full !h-[40px] !bg-mainColor disabled:!bg-gray-500/20"
                          )}
                          disabled={
                            !isGreaterThanOrEqualTo(
                              getCurrentTimestamp(),
                              asset.genesisDate ?? "0"
                            ) || asset.symbol?.toLocaleLowerCase() == "xsolv"
                          }
                          onClick={() => {
                            setWithdrawDialogOpen(true);
                            setSelectedAsset(asset);
                          }}
                        >
                          <span className="text-base">Withdraw</span>
                        </Button>
                      )}
                    </>
                  ) : (
                    <Button className="!w-full !mt-4 !rounded-full" disabled>
                      <span className="text-base">Manage on Solv.Finance</span>
                    </Button>
                  )}
                </div>
              </Card>
            ))
          ) : (
            <NoData className="mt-4" />
          )}
        </div>
      )}

      <Pagination
        pageCount={Math.ceil(totalCount / limit)}
        handlePageChange={handlePageChange}
      />

      <WithdrawDialog
        open={withdrawDialogOpen}
        onOpenChange={setWithdrawDialogOpen}
        asset={selectedAsset}
      />
    </Card>
  );
};

export default Holdings;
