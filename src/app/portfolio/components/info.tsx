"use client";

import classNames from "classnames";
import Image from "next/image";
import { useAccount } from "wagmi";

import { GET_AssetsByHolder } from "@/graphql/queries/assets";
import { useQuery } from "@apollo/client";
import { Card, Flex, Skeleton } from "@radix-ui/themes";
import { CopyHelper } from "@/components/CopyHelper";
import { formatAddress, formatNumber, restrictDecimals } from "@/lib";
import { useSolvBtcStore } from "@/states";

const Info = () => {
  const { address } = useAccount();
  const { data: assets } = useQuery(GET_AssetsByHolder, {
    variables: {
      holder: address
    },
    skip: !address
  });

  const { mode } = useSolvBtcStore();

  return (
    <Card className="!p-0 my-4">
      <div
        className={classNames(
          "bg-contain bg-no-repeat bg-right p-6 flex flex-col justify-between",
          {
            "bg-[url('/account-banner-h5-dark.png')]": mode === "dark",
            "bg-[url('/account-banner-h5.png')]": mode === "light"
          }
        )}
      >
        <div className="flex items-center gap-2 mb-8">
          <Image
            src={"https://avatar.sft-api.com/avatar/22.png"}
            alt="avatar"
            width={40}
            height={40}
            className="rounded-full border border-solid p-2 border-grayColor/20"
          />

          {address ? (
            <CopyHelper data={address} size="14px">
              <span className="text-[14px]">{formatAddress(address)}</span>
            </CopyHelper>
          ) : (
            <Skeleton className="w-40 h-4" />
          )}
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <div className="text-grayColor text-sm">My Total Assets</div>
            {assets?.assetsByHolder?.totalBalanceUSD ? (
              <div className="text-[32px] font-MatterSQ-SemiBold">
                {formatNumber(
                  restrictDecimals(
                    assets?.assetsByHolder?.totalBalanceUSD ?? 0,
                    2
                  )
                )}
              </div>
            ) : (
              <Skeleton className="w-40 h-10" />
            )}
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-grayColor text-sm">Number Of Vaults</div>
            {assets?.assetsByHolder?.assetsInfo ? (
              <div className="text-[32px] font-MatterSQ-SemiBold">
                {assets?.assetsByHolder?.assetsInfo?.length}
              </div>
            ) : (
              <Skeleton className="w-40 h-10" />
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Info;
