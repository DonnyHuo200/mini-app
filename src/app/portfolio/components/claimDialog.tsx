import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract
} from "wagmi";
import {
  Address,
  decodeAbiParameters,
  encodeFunctionData,
  erc721Abi,
  formatUnits
} from "viem";
import {
  beautyAmount,
  minus,
  multipliedBy,
  outputTokenAmount
} from "@/lib/utils";
import {
  Button,
  AlertDialog,
  Popover,
  ChevronDownIcon,
  Skeleton
} from "@radix-ui/themes";
import { parseAbi } from "abitype";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { Cross1Icon, InfoCircledIcon } from "@radix-ui/react-icons";
import { formatNumber, restrictDecimals } from "@/lib";
import { useStore } from "@/states";
import claimAbi from "@/abi/portfolio/claim.json";
import delegateAbi from "@/abi/portfolio/delegate.json";

const ClaimDialog = ({
  open,
  onOpenChange,
  asset
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  asset: any;
}) => {
  const {
    setTradingResultInfo,
    setTradingOpen,
    setTradingResultOpen,
    setTradingResultTitle,
    setTradingHash
  } = useStore();

  const router = useRouter();

  const viemABI = [
    {
      type: "function",
      name: "claimableValue",
      inputs: [
        {
          name: "tokenId_",
          type: "uint256"
        }
      ],
      stateMutability: "nonpayable"
    }
  ];

  const enc_data = encodeFunctionData({
    abi: viemABI,
    functionName: "claimableValue",
    args: [BigInt(asset?.tokenId)]
  });

  const { data: delegateData, isLoading: delegateLoading } = useReadContract({
    address: asset?.contractAddress,
    abi: delegateAbi,
    functionName: "delegateToConcreteView",
    args: [enc_data],
    query: {
      enabled: !!enc_data
    }
  });

  const amountStr = useMemo(() => {
    return delegateData
      ? decodeAbiParameters(
          [{ type: "uint256" }],
          delegateData as `0x${string}`
        )[0].toString()
      : "0";
  }, [delegateData]);

  const totalClaimable = useMemo(() => {
    return parseInt(
      outputTokenAmount(
        multipliedBy(amountStr, asset?.nav || 0),
        asset?.productInfo?.contractInfo?.decimals || 1
      )
    );
  }, [amountStr, asset?.nav, asset?.productInfo?.contractInfo?.decimals]);

  const pendingRepaymentValue = useMemo(() => {
    const assetValue = outputTokenAmount(
      multipliedBy(asset?.balance || "0", asset.nav || "0"),
      asset?.productInfo?.contractInfo?.decimals || 1
    );

    let res = minus(assetValue, totalClaimable);
    res = beautyAmount({
      value: outputTokenAmount(res, asset?.currenyInfo?.decimals || 1),
      poly: false
    });
    return res;
  }, [
    asset?.balance,
    asset?.currenyInfo?.decimals,
    asset.nav,
    asset?.productInfo?.contractInfo?.decimals,
    totalClaimable
  ]);

  // claim function
  const {
    writeContract: claimWriteContract,
    isPending: claimPending,
    data: claimDataHash
  } = useWriteContract();

  const {
    isLoading: claimLoading,
    isSuccess: claimSuccess,
    error: claimError
  } = useWaitForTransactionReceipt({
    hash: claimDataHash,
    query: { enabled: !!claimDataHash }
  });

  const ClaimFun = async () => {
    await claimWriteContract({
      abi: claimAbi,
      address: asset?.contractAddress as Address,
      functionName: "claimTo",
      args: [
        asset?.holder,
        asset?.tokenId,
        asset?.currenyInfo?.currencyAddress,
        totalClaimable
      ]
    });
  };

  useEffect(() => {
    if (claimLoading) {
      setTradingOpen(true);
      setTradingHash(claimDataHash);
      onOpenChange(false);
    }
    if (claimSuccess) {
      setTradingOpen(false);
      setTradingResultTitle("Claimed successfully");
      setTradingResultInfo(
        "You have successfully claimed " +
          formatNumber(
            restrictDecimals(
              formatUnits(
                totalClaimable ? BigInt(totalClaimable) : BigInt(0),
                asset?.currenyInfo?.decimals
              ),
              6
            )
          ) +
          " " +
          asset?.currenyInfo?.symbol +
          "!"
      );
      setTradingResultOpen(true);
    }
    if (claimError) {
      console.error("Claim Error");
      onOpenChange(false);
    }
  }, [claimSuccess, claimLoading, claimError]);

  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Content maxWidth="450px">
        <AlertDialog.Title>
          <span className="text-xl font-MatterSQ-Regular font-bold">Claim</span>
        </AlertDialog.Title>
        <AlertDialog.Description className="text-gray-500" size="2">
          <span>You are claiming</span> <span>{asset?.productInfo?.name}</span>{" "}
          <span>#{asset?.tokenId}</span>
        </AlertDialog.Description>

        <div
          className="absolute top-6 right-6"
          onClick={() => {
            onOpenChange(false);
          }}
        >
          <Cross1Icon width={16} height={16} />
        </div>

        <div className="text-sm mt-6">Claimable</div>

        <div className="text-2xl font-MatterSQ-Regular font-bold flex items-center gap-1 mt-1">
          {delegateLoading ? (
            <Skeleton className="w-40 h-6" />
          ) : (
            <>
              <span>
                {formatNumber(
                  restrictDecimals(
                    formatUnits(
                      totalClaimable ? BigInt(totalClaimable) : BigInt(0),
                      asset?.currenyInfo?.decimals
                    ),
                    6
                  )
                )}
              </span>
              <span>{asset?.currenyInfo?.symbol}</span>
            </>
          )}
        </div>

        <div className="flex items-center justify-between gap-1 text-sm mt-4 bg-gray-400/10 py-2 px-4 rounded-md">
          <div className="flex items-center gap-1">
            <span>Pending Repayment</span>
            <Popover.Root>
              <Popover.Trigger>
                <div className="flex items-center gap-1">
                  <InfoCircledIcon width={12} height={12} />
                </div>
              </Popover.Trigger>
              <Popover.Content side="top" align="center">
                <span className="text-sm">Amount remaining to be repaid.</span>
              </Popover.Content>
            </Popover.Root>
          </div>

          {delegateLoading ? (
            <Skeleton loading className="w-20 h-5" />
          ) : (
            <span>
              {pendingRepaymentValue} {asset?.currenyInfo?.symbol}
            </span>
          )}
        </div>
        <div className="mt-6 w-full">
          <Button
            className="!rounded-full !bg-mainColor !w-full !h-[40px]"
            loading={claimPending || claimLoading}
            onClick={ClaimFun}
          >
            <span className="text-base">Confirm</span>
          </Button>
        </div>
        <div
          className="text-sm mt-4 text-mainColor text-center"
          onClick={() => {
            router.push("/btcPlus");
          }}
        >
          Looking for a better yield option? Check out BTC+!
        </div>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
};

export default ClaimDialog;
