"use client";

import classNames from "classnames";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { formatUnits } from "viem";
import { useAccount, useChainId, useChains } from "wagmi";

import { formatNumber as formatThousands } from "@/lib/utils";
import { GET_ASSETS_PORTFOLIO_GRAPHQL } from "@/graphql/queries/assets";
import { useQuery } from "@apollo/client";
import { Button, Card, Popover, Skeleton } from "@radix-ui/themes";
import { formatNumber, GET_NETWORK_ICON, restrictDecimals } from "@/lib";
import AccountPerch from "@/assets/images/account-perch.svg";
import NoData from "@/components/NoData";
import Pagination from "@/components/Pagination";

import ClaimDialog from "./claimDialog";
import RevokeDialog from "./revokeDialog";

const Redemptions = () => {
  const { address } = useAccount();

  const currentChainId = useChainId();

  const [limit] = useState(5);

  const [offset, setOffset] = useState(0);

  const { data, refetch, previousData } = useQuery(
    GET_ASSETS_PORTFOLIO_GRAPHQL,
    {
      variables: {
        filter: {
          holder: address,
          chainId: [],
          saleStatus: [],
          productType: ["Open Fund Redemptions"]
        },
        pagination: {
          offset: offset * limit,
          limit: limit
        },
        sort: {
          field: "mintTime",
          direction: "DESC"
        }
      },
      skip: !address
    }
  );

  const assets = useMemo(() => {
    return data?.assets?.assetsInfo;
  }, [data]);

  const chains = useChains();

  const getNetworkInfo = (chainId: string) => {
    const currentChain = chains.find((chain) => chain.id === Number(chainId));

    return {
      name: currentChain?.name,
      icon: GET_NETWORK_ICON(currentChain?.name?.toLowerCase() ?? "1")
    };
  };

  const totalCount = useMemo(() => {
    return data?.assets?.totalCount ?? previousData?.assets?.totalCount ?? 0;
  }, [data, previousData]);

  const handlePageChange = (selectedItem: { selected: number }) => {
    setOffset(selectedItem.selected);
  };

  useEffect(() => {
    refetch();
  }, [offset]);

  const getRedeemState = (state: string) => {
    switch (state) {
      case "Pending":
        return "Pending";
      case "Claimable":
        return "Ready to claim";
      case "Redeeming":
        return "Pending";
      case "Revoked":
        return "Claimed";
    }
  };

  const router = useRouter();

  const goToPage = (asset: any) => {
    console.log("asset", asset);
    if (asset?.subtype === "FOF") {
      router.push(`/solvbtc#faqs`);
    }
    if (asset?.yieldType === "BTC+") {
      router.push(`/btcPlus#overview`);
    }
  };

  const [revokeOpen, setRevokeOpen] = useState(false);
  const [claimOpen, setClaimOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<any>(null);

  return (
    <Card className="!p-6 my-4">
      <div className="text-2xl font-MatterSQ-Medium">My Redemptions</div>

      {!assets ? (
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
      ) : assets?.length > 0 ? (
        assets.map((asset: any) => (
          <Card key={asset.id} className="text-sm mt-4 !py-4 ">
            <div className="flex items-center gap-2">
              <Image
                width={20}
                height={20}
                src={AccountPerch}
                alt="account-perch"
              />
              <div className="font-MatterSQ-Medium">
                {asset?.productInfo?.name}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4">
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
                <span className="text-grayColor text-xs">Status</span>

                <button
                  className={classNames("text-left", {
                    "text-yellow-500":
                      asset?.redeemState === "Redeeming" ||
                      asset?.redeemState === "Pending",
                    "text-green-500": asset?.redeemState === "Claimable",
                    "text-mainColor": asset?.redeemState === "Revoked",
                    "underline decoration-dashed":
                      asset?.subtype === "FOF" || asset?.yieldType === "BTC+"
                  })}
                  disabled={
                    asset?.redeemState === "Claimable" ||
                    asset?.redeemState === "Revoked"
                  }
                  onClick={() => goToPage(asset)}
                >
                  <span>{getRedeemState(asset?.redeemState)}</span>
                </button>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-grayColor text-xs">Amount</span>
                <span>
                  {formatNumber(
                    restrictDecimals(
                      formatUnits(
                        asset?.balance,
                        asset?.productInfo?.contractInfo?.decimals
                      ),
                      6
                    )
                  )}
                </span>
              </div>
              <div>
                <span className="text-grayColor text-xs">Value</span>
                <div className="flex items-center gap-2">
                  <Popover.Root>
                    <Popover.Trigger>
                      <button
                        className={classNames("flex items-center gap-1", {
                          "underline decoration-dashed":
                            asset?.redeemState !== "Claimable"
                        })}
                        disabled={asset?.redeemState == "Claimable"}
                      >
                        <span>
                          {formatNumber(
                            restrictDecimals(
                              Number(
                                formatUnits(
                                  asset?.balance,
                                  asset?.currenyInfo?.decimals
                                )
                              ) * Number(formatUnits(asset?.nav, 18)),
                              6
                            )
                          )}
                        </span>
                        <span>{asset?.currenyInfo?.symbol}</span>
                      </button>
                    </Popover.Trigger>
                    <Popover.Content side="top">
                      <div className="text-sm max-w-[300px]">
                        The final redemption value may change subject to the
                        final redemption NAV.
                      </div>
                    </Popover.Content>
                  </Popover.Root>

                  <span className="text-xs">
                    ${formatThousands(asset?.usdValue)}
                  </span>
                </div>
              </div>
            </div>

            {asset?.chainId === currentChainId ? (
              <div className="flex items-center gap-2 mt-4">
                <Button
                  className={classNames(
                    "!flex-1 !rounded-full disabled:!bg-gray-500/20 !h-[40px]",
                    {
                      "!bg-mainColor": asset?.redeemState === "Claimable"
                    }
                  )}
                  disabled={!(asset?.redeemState === "Claimable")}
                  onClick={() => {
                    setClaimOpen(true);
                    setSelectedAsset(asset);
                  }}
                >
                  Claim
                </Button>

                <Button
                  className={classNames(
                    "!flex-1 !rounded-full disabled:!bg-gray-500/20 !h-[40px]",
                    {
                      "!bg-mainColor": asset?.redeemState === "Pending"
                    }
                  )}
                  disabled={!(asset?.redeemState === "Pending")}
                  onClick={() => {
                    setRevokeOpen(true);
                    setSelectedAsset(asset);
                  }}
                >
                  Revoke
                </Button>
              </div>
            ) : (
              <Button
                className="!w-full !mt-4 !rounded-full !h-[40px]"
                disabled
              >
                Manage on Solv.Finance
              </Button>
            )}
          </Card>
        ))
      ) : (
        <NoData className="mt-4" />
      )}

      <Pagination
        pageCount={Math.ceil(totalCount / limit)}
        handlePageChange={handlePageChange}
      />

      {selectedAsset && (
        <RevokeDialog
          open={revokeOpen}
          onOpenChange={setRevokeOpen}
          asset={selectedAsset}
        />
      )}

      {selectedAsset && (
        <ClaimDialog
          open={claimOpen}
          onOpenChange={setClaimOpen}
          asset={selectedAsset}
        />
      )}
    </Card>
  );
};

export default Redemptions;
