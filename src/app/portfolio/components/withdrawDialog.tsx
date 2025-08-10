import {
  useAccount,
  useConnect,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract
} from "wagmi";
import classNames from "classnames";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Address, erc20Abi, formatUnits, parseUnits } from "viem";

import { Button, Card, Skeleton } from "@radix-ui/themes";
import { useQuery } from "@apollo/client";
import { getBtcPoolInfoQuery } from "@/graphql/queries/pools";
import { formatNumber, GET_TOKEN_ICON, restrictDecimals } from "@/lib";
import { GetRedemptionFeeRate } from "@/graphql/queries/solvbtc";
import { minus, multipliedBy, outputTokenAmount } from "@/lib/utils";
import { useSolvBtcStore, useStore } from "@/states";
import DialogWrapper from "@/components/Dialog";
import withdrawAbi from "@/abi/solvbtc/withdraw.json";
import withdrawBTCPlusAbi from "@/abi/btc+/withdraw.json";

const WithdrawDialog = ({
  open,
  onOpenChange,
  asset
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  asset: any;
}) => {
  const { mode } = useSolvBtcStore();

  const {
    setTradingResultInfo,
    setTradingOpen,
    setTradingResultOpen,
    setTradingResultTitle,
    setTradingHash
  } = useStore();

  const { data: btcPoolInfoData } = useQuery(getBtcPoolInfoQuery, {
    variables: {
      filter: {
        poolSlotInfoId: asset?.poolSlotInfoId
      }
    },
    skip: !asset?.poolSlotInfoId
  });

  const btcPoolInfo = useMemo(() => {
    return btcPoolInfoData?.btcPoolInfo;
  }, [btcPoolInfoData]);

  const { address, isConnected } = useAccount();

  const { connect, connectors } = useConnect();

  const isBTCPlus = useMemo(() => {
    return asset?.yieldType === "BTC+";
  }, [asset]);

  // get balance
  const {
    data: balanceOf,
    refetch: refetchBalance,
    status: balanceStatus
  } = useReadContract({
    address: btcPoolInfo?.wrappedTokenInfo?.tokenAddress,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [address as Address],
    query: {
      enabled: !!address || !!btcPoolInfo?.wrappedTokenInfo?.tokenAddress
    }
  });

  const balance = useMemo(() => {
    return formatUnits(
      balanceOf ?? BigInt(0),
      btcPoolInfo?.wrappedTokenInfo?.decimals
    );
  }, [balanceOf]);

  const { data: redemptionFeeRate } = useQuery(GetRedemptionFeeRate, {
    variables: {
      chainId: asset?.chainId,
      poolId: asset?.poolId
    }
  });

  const rate = useMemo(() => {
    return redemptionFeeRate?.getRedemptionFeeRate;
  }, [redemptionFeeRate]);

  const [amount, setAmount] = useState("");
  const [receiveAmount, setReceiveAmount] = useState<string | number>("");

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;
    inputValue = inputValue.replace(/[^0-9.]/g, "");
    inputValue = inputValue.replace(/(\..*)\./g, "$1");
    const parts = inputValue.split(".");
    if (parts[1] && parts[1].length > btcPoolInfo?.wrappedTokenInfo?.decimals) {
      inputValue = `${parts[0]}.${parts[1].slice(
        0,
        btcPoolInfo?.wrappedTokenInfo?.decimals
      )}`;
    }
    setAmount(inputValue);
    if (inputValue === "" || inputValue == ".") {
      setReceiveAmount("");
    } else {
      setReceiveAmount(
        multipliedBy(
          multipliedBy(
            inputValue,
            outputTokenAmount(
              btcPoolInfo?.poolInfo?.nav || 1,
              btcPoolInfo?.poolInfo?.currencyInfo?.decimals || 0
            )
          ),
          minus(1, rate)
        )
      );
    }
  };

  const maxFun = () => {
    setAmount(balance);
    if (balance === "" || balance == ".") {
      setReceiveAmount("");
    } else {
      setReceiveAmount(
        multipliedBy(
          multipliedBy(
            balance,
            outputTokenAmount(
              btcPoolInfo?.nav || 1,
              btcPoolInfo?.currencyInfo?.decimals || 0
            )
          ),
          minus(1, rate)
        )
      );
    }
  };

  const noBalance = useMemo(() => {
    return Number(amount) > Number(balance);
  }, [amount, balance]);

  // withdraw
  const {
    writeContract: withdrawWriteContract,
    isPending: withdrawPending,
    data: withdrawDataHash
  } = useWriteContract();

  const withdrawFun = async () => {
    if (isBTCPlus) {
      await withdrawWriteContract({
        abi: withdrawBTCPlusAbi,
        address: btcPoolInfo?.routerContract?.contractAddress,
        functionName: "withdrawRequest",
        args: [
          btcPoolInfo?.wrappedTokenInfo?.tokenAddress,
          btcPoolInfo?.poolInfo?.currencyInfo?.currencyAddress,
          parseUnits(amount, btcPoolInfo?.wrappedTokenInfo?.decimals)
        ]
      });
    } else {
      await withdrawWriteContract({
        abi: withdrawAbi,
        address: btcPoolInfo?.routerContract?.contractAddress,
        functionName: "createRedemption",
        args: [
          asset?.poolId,
          parseUnits(amount, btcPoolInfo?.wrappedTokenInfo?.decimals)
        ]
      });
    }
  };

  const { isLoading: withdrawLoading, isSuccess: withdrawSuccess } =
    useWaitForTransactionReceipt({
      hash: withdrawDataHash,
      query: { enabled: !!withdrawDataHash }
    });

  useEffect(() => {
    if (withdrawLoading) {
      onOpenChange(false);
      setTradingOpen(true);
      setTradingHash(withdrawDataHash);
    }
    if (withdrawSuccess) {
      refetchBalance();
      setAmount("");
      setReceiveAmount("");

      setTradingOpen(false);
      setTradingResultTitle("Withdraw successfully");
      setTradingResultInfo(
        "Check progress in 'My Portfolio' - ‘My Redemptions‘ and claim assets when completed."
      );
      setTradingResultOpen(true);
    }
  }, [withdrawSuccess, withdrawLoading]);

  useEffect(() => {
    if (open) {
      setAmount("");
      setReceiveAmount("");
    }
  }, [open]);

  const BTCReceiveAmount = useMemo(() => {
    return multipliedBy(
      amount,
      formatUnits(
        btcPoolInfo?.poolInfo?.nav || 1,
        btcPoolInfo?.poolInfo?.currencyInfo?.decimals || 0
      )
    );
  }, [receiveAmount, btcPoolInfo]);

  return (
    <DialogWrapper
      open={open}
      onOpenChange={onOpenChange}
      title="Withdraw"
      closeIcon={true}
      description={
        !isBTCPlus ? <>Unlock {asset?.symbol} to get Fund SFT</> : ""
      }
    >
      <div className="flex flex-col gap-4 mt-4 text-sm">
        <div>
          <div className="flex justify-between mb-2">
            <span>Amount</span>
            <span
              className={classNames({
                "text-red-500": noBalance
              })}
            >
              {balanceStatus === "success" ? (
                <>
                  <span
                    className={classNames("text-gray-500", {
                      "text-red-500": noBalance
                    })}
                  >
                    {isBTCPlus ? "Balance" : "Available"}:{" "}
                  </span>
                  <span>{formatNumber(restrictDecimals(balance, 6))}</span>
                </>
              ) : (
                <Skeleton loading className="w-28 h-5"></Skeleton>
              )}
            </span>
          </div>
          <div
            className={classNames(
              "flex justify-between h-[40px] px-4 py-2 rounded-md border border-solid border-gray-500/50 focus-within:border-mainColor",
              {
                "!border-red-500": noBalance,
                "!bg-black": mode == "dark"
              }
            )}
          >
            <div className="flex-1 flex items-center justify-center">
              <input
                className="w-full bg-transparent outline-none"
                type="text"
                value={amount}
                onChange={handleAmountChange}
              />
            </div>
            <div className="flex items-center gap-2">
              {btcPoolInfo?.wrappedTokenInfo ? (
                <>
                  <span className="text-mainColor" onClick={maxFun}>
                    Max
                  </span>

                  <div className="flex items-center gap-1">
                    <Image
                      src={GET_TOKEN_ICON(
                        btcPoolInfo?.wrappedTokenInfo?.symbol
                      )}
                      alt={btcPoolInfo?.wrappedTokenInfo?.symbol || ""}
                      width={16}
                      height={16}
                    />
                    <span>
                      {btcPoolInfo?.wrappedTokenInfo?.symbol?.split(".")[0]}
                    </span>
                  </div>
                </>
              ) : (
                <Skeleton loading className="w-20 h-5"></Skeleton>
              )}
            </div>
          </div>
        </div>
        {isBTCPlus ? (
          <Card className="!p-4">
            <div className="mb-2 flex items-center flex-wrap justify-between">
              <span className="text-gray-500">You will recevice </span>
              <span className="break-all">
                {amount
                  ? formatNumber(restrictDecimals(BTCReceiveAmount, 6))
                  : "0.00"}{" "}
                {btcPoolInfo?.poolInfo?.currencyInfo?.symbol}
              </span>
            </div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-gray-500">Exchange rate </span>
              <span>
                1 {btcPoolInfo?.wrappedTokenInfo?.symbol} ={" "}
                {formatNumber(
                  restrictDecimals(
                    formatUnits(
                      btcPoolInfo?.poolInfo?.nav || 1,
                      btcPoolInfo?.poolInfo?.currencyInfo?.decimals
                    ),
                    6
                  )
                )}{" "}
                {btcPoolInfo?.poolInfo?.currencyInfo?.symbol}
              </span>
            </div>
          </Card>
        ) : (
          <div>
            <div className="mb-2">Receive</div>
            <div
              className={classNames(
                "flex items-center justify-between px-4 py-2 rounded-md border border-solid border-gray-500/50 focus-within:border-mainColor",
                {
                  "!border-red-500": noBalance,
                  "!bg-black": mode == "dark"
                }
              )}
            >
              <div className="flex-1 flex items-center justify-center">
                <input
                  className="bg-transparent outline-none w-full"
                  value={receiveAmount}
                  type="text"
                  disabled
                />
              </div>
              <div className="flex items-center gap-1">
                {btcPoolInfo?.poolInfo?.currencyInfo ? (
                  <>
                    <Image
                      src={GET_TOKEN_ICON(
                        btcPoolInfo?.poolInfo?.currencyInfo?.symbol
                      )}
                      alt={btcPoolInfo?.poolInfo?.currencyInfo?.symbol || ""}
                      width={16}
                      height={16}
                    />
                    <div>{btcPoolInfo?.poolInfo?.currencyInfo?.symbol}</div>
                  </>
                ) : (
                  <Skeleton loading className="w-20 h-5"></Skeleton>
                )}
              </div>
            </div>
          </div>
        )}
        {isConnected ? (
          <>
            {noBalance ? (
              <Button
                className="!w-full !mt-4 !rounded-full !h-[40px]"
                disabled
              >
                <span className="text-base">Insufficient wallet balance</span>
              </Button>
            ) : (
              <Button
                className="!w-full !mt-4 !rounded-full !h-[40px] !bg-mainColor"
                onClick={withdrawFun}
                loading={withdrawPending || withdrawLoading}
              >
                <span className="text-base">Confirm</span>
              </Button>
            )}
          </>
        ) : (
          <Button
            className="!w-full bg-transparent !rounded-full !h-10 !mt-4 !bg-mainColor"
            onClick={() => connect({ connector: connectors[0] })}
          >
            <span className="text-[16px] font-MatterSQ-Regular">
              Connect Wallet
            </span>
          </Button>
        )}
      </div>
    </DialogWrapper>
  );
};

export default WithdrawDialog;
