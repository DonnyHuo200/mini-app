"use client";

import {
  useAccount,
  useConnect,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract
} from "wagmi";
import {
  beautyAmount,
  dividedBy,
  hideMantissa,
  minus,
  multipliedBy,
  outputTokenAmount,
  toFixed
} from "@/lib/utils";
import {
  formatNumber,
  GET_TOKEN_ICON,
  handleDepositExchangeRate,
  restrictDecimals
} from "@/lib";
import BigNumber from "bignumber.js";
import classNames from "classnames";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Address, erc20Abi, formatUnits, maxUint256, parseUnits } from "viem";

import { Button, Card, Skeleton } from "@radix-ui/themes";
import { useQuery } from "@apollo/client";
import { useSolvBtcStore, useStore } from "@/states";
import { getSolvBTCFee } from "@/graphql/queries/solvbtc";
import withdrawAbi from "@/abi/btc+/withdraw.json";

const Withdraw = ({ btcPoolInfo }: { btcPoolInfo: any }) => {
  const { mode } = useSolvBtcStore();

  const {
    setTradingResultInfo,
    setTradingOpen,
    setTradingResultOpen,
    setTradingResultTitle,
    setTradingHash,
    setTradingInfo
  } = useStore();

  const { address, isConnected } = useAccount();

  const { connect, connectors } = useConnect();

  // get base balance
  const {
    data: baseBalanceOf,
    refetch: refetchBalance,
    status: baseBalanceStatus
  } = useReadContract({
    abi: erc20Abi,
    address: btcPoolInfo?.btcPoolInfo?.wrappedTokenInfo?.tokenAddress,
    functionName: "balanceOf",
    args: [address as Address],
    query: {
      enabled:
        !!btcPoolInfo?.btcPoolInfo?.wrappedTokenInfo?.tokenAddress && !!address
    }
  });

  const baseBalance = useMemo(() => {
    return formatUnits(
      baseBalanceOf || BigInt(0),
      btcPoolInfo?.btcPoolInfo?.wrappedTokenInfo?.decimals
    );
  }, [baseBalanceOf, btcPoolInfo?.btcPoolInfo?.wrappedTokenInfo?.decimals]);

  // get target balance
  const { data: targetBalanceOf, status: targetBalanceStatus } =
    useReadContract({
      abi: erc20Abi,
      address:
        btcPoolInfo?.btcPoolInfo?.poolInfo?.currencyInfo?.currencyAddress,
      functionName: "balanceOf",
      args: [address as Address],
      query: {
        enabled:
          !!btcPoolInfo?.btcPoolInfo?.poolInfo?.currencyInfo?.currencyAddress &&
          !!address
      }
    });

  const targetBalance = useMemo(() => {
    return formatUnits(
      targetBalanceOf || BigInt(0),
      btcPoolInfo?.btcPoolInfo?.poolInfo?.currencyInfo?.decimals
    );
  }, [
    targetBalanceOf,
    btcPoolInfo?.btcPoolInfo?.poolInfo?.currencyInfo?.decimals
  ]);

  // get allowed amount
  const {
    data: allowedAmountOf,
    refetch: refetchAllowance,
    status: allowanceStatus
  } = useReadContract({
    abi: erc20Abi,
    address: btcPoolInfo?.btcPoolInfo?.wrappedTokenInfo?.tokenAddress,
    functionName: "allowance",
    args: [
      address as Address,
      btcPoolInfo?.btcPoolInfo?.routerContract?.contractAddress
    ]
  });

  const allowedAmount = useMemo(() => {
    return formatUnits(
      allowedAmountOf || BigInt(0),
      btcPoolInfo?.btcPoolInfo?.wrappedTokenInfo?.decimals
    );
  }, [allowedAmountOf, btcPoolInfo?.btcPoolInfo?.wrappedTokenInfo?.decimals]);

  // approve
  const {
    writeContract: approveWriteContract,
    isPending: approvePending,
    data: dataHash,
    reset: resetApproveWrite
  } = useWriteContract();

  const approveFun = async () => {
    await approveWriteContract({
      abi: erc20Abi,
      address: btcPoolInfo?.btcPoolInfo?.wrappedTokenInfo
        ?.tokenAddress as Address,
      functionName: "approve",
      args: [
        btcPoolInfo?.btcPoolInfo?.routerContract?.contractAddress,
        maxUint256
      ]
    });
  };

  const {
    isLoading: approveLoading,
    isSuccess: approveSuccess,
    error: approveError
  } = useWaitForTransactionReceipt({
    hash: dataHash,
    query: { enabled: !!dataHash }
  });

  useEffect(() => {
    if (approveError) {
      console.error("Approve Error");
    }
    if (approveSuccess) {
      console.info("Approve Success");
      refetchAllowance();
      resetApproveWrite();
    }
  }, [approveSuccess, approveError, refetchAllowance, resetApproveWrite]);

  // get fee data
  const { data: feeData } = useQuery(getSolvBTCFee, {
    variables: {
      poolId: btcPoolInfo?.btcPoolInfo?.poolInfo?.poolOrderInfo?.poolId,
      symbol: btcPoolInfo?.btcPoolInfo?.wrappedTokenInfo?.symbol
    },
    skip:
      !btcPoolInfo?.btcPoolInfo?.wrappedTokenInfo?.symbol &&
      !btcPoolInfo?.btcPoolInfo?.poolInfo?.poolOrderInfo?.poolId
  });

  // get exchange rate
  const exchangeRate = useMemo(() => {
    return beautyAmount({
      value: multipliedBy(
        1,
        outputTokenAmount(
          btcPoolInfo?.btcPoolInfo?.poolInfo?.nav || 1 * 1e18,
          btcPoolInfo?.btcPoolInfo?.poolInfo?.currencyInfo?.decimals || 18
        )
      ),
      poly: false
    });
  }, [
    btcPoolInfo?.btcPoolInfo?.poolInfo?.nav,
    btcPoolInfo?.btcPoolInfo?.poolInfo?.currencyInfo?.decimals
  ]);

  const [baseTokenAmount, setBaseTokenAmount] = useState<string>("");

  const [targetTokenAmount, setTargetTokenAmount] = useState<string>("");

  // get total fee
  const totalFee = useMemo(() => {
    return new BigNumber(Number(baseTokenAmount ?? "0"))
      .multipliedBy(new BigNumber(feeData?.solvbtcFee ?? 0))
      .toString();
  }, [feeData?.solvbtcFee, baseTokenAmount]);

  // withdraw
  const {
    writeContract: withdrawWriteContract,
    isPending: withdrawPending,
    data: withdrawDataHash,
    reset: resetwithdrawWrite
  } = useWriteContract();

  const withdrawFun = async () => {
    await withdrawWriteContract({
      abi: withdrawAbi,
      address: btcPoolInfo?.btcPoolInfo?.routerContract?.contractAddress,
      functionName: "withdrawRequest",
      args: [
        btcPoolInfo?.btcPoolInfo?.wrappedTokenInfo?.tokenAddress,
        btcPoolInfo?.btcPoolInfo?.poolInfo?.currencyInfo?.currencyAddress,
        parseUnits(
          baseTokenAmount,
          btcPoolInfo?.btcPoolInfo?.wrappedTokenInfo?.decimals
        )
      ]
    });
  };

  const {
    isLoading: withdrawLoading,
    isSuccess: withdrawSuccess,
    error: withdrawError
  } = useWaitForTransactionReceipt({
    hash: withdrawDataHash,
    query: { enabled: !!withdrawDataHash }
  });

  useEffect(() => {
    if (withdrawError) {
      console.error("withdraw Error");
    }
    if (approveSuccess) {
      console.info("Approve Success");
      resetwithdrawWrite();
      refetchBalance();
    }

    if (withdrawLoading) {
      setTradingOpen(true);
      setTradingHash(withdrawDataHash);
      setTradingInfo(
        `You are withdrawing ${formatNumber(baseTokenAmount)} ${
          btcPoolInfo?.btcPoolInfo?.wrappedTokenInfo?.symbol
        }`
      );
    }

    if (withdrawSuccess) {
      setTradingOpen(false);
      setTradingResultTitle("Submitted successfully");

      setTradingResultInfo(
        `Check progress in 'My Portfolio' - ‘My Redemptions‘ and claim assets when completed.`
      );
      setTradingResultOpen(true);
    }
  }, [
    withdrawSuccess,
    approveSuccess,
    withdrawError,
    withdrawLoading,
    setTradingOpen,
    setTradingHash,
    setTradingInfo,
    resetwithdrawWrite,
    refetchBalance
  ]);

  const withdrawChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;
    inputValue = inputValue.replace(/[^0-9.]/g, "");
    inputValue = inputValue.replace(/(\..*)\./g, "$1");
    const parts = inputValue.split(".");
    if (
      parts[1] &&
      parts[1].length > btcPoolInfo?.btcPoolInfo?.wrappedTokenInfo?.decimals
    ) {
      inputValue = `${parts[0]}.${parts[1].slice(
        0,
        btcPoolInfo?.btcPoolInfo?.wrappedTokenInfo?.decimals
      )}`;
    }
    setBaseTokenAmount(inputValue);
    if (inputValue === "" || inputValue == ".") {
      setTargetTokenAmount("");
    } else {
      let shareValue = multipliedBy(
        inputValue || "0",
        outputTokenAmount(
          btcPoolInfo?.btcPoolInfo?.poolInfo?.nav || 1 * 1e18,
          btcPoolInfo?.btcPoolInfo?.poolInfo?.currencyInfo?.decimals || 0
        )
      );

      shareValue = multipliedBy(shareValue, minus(1, feeData?.solvbtcFee ?? 0));

      setTargetTokenAmount(shareValue);
    }
  };

  const maxFun = () => {
    setBaseTokenAmount(baseBalance);
    let shareValue = multipliedBy(
      baseBalance || "0",
      outputTokenAmount(
        btcPoolInfo?.btcPoolInfo?.poolInfo?.nav || 1 * 1e18,
        btcPoolInfo?.btcPoolInfo?.poolInfo?.currencyInfo?.decimals || 0
      )
    );
    shareValue = multipliedBy(shareValue, minus(1, feeData?.solvbtcFee ?? 0));
    setTargetTokenAmount(shareValue);
  };

  const receiveChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;
    inputValue = inputValue.replace(/[^0-9.]/g, "");
    inputValue = inputValue.replace(/(\..*)\./g, "$1");
    const parts = inputValue.split(".");
    if (
      parts[1] &&
      parts[1].length >
        btcPoolInfo?.btcPoolInfo?.poolInfo?.currencyInfo?.decimals
    ) {
      inputValue = `${parts[0]}.${parts[1].slice(
        0,
        btcPoolInfo?.btcPoolInfo?.poolInfo?.currencyInfo?.decimals
      )}`;
    }
    setTargetTokenAmount(inputValue);

    if (inputValue === "" || inputValue == ".") {
      setBaseTokenAmount("");
    } else {
      let orgAmountValue = dividedBy(
        inputValue,
        outputTokenAmount(
          btcPoolInfo?.btcPoolInfo?.poolInfo?.nav || 1 * 1e18,
          btcPoolInfo?.btcPoolInfo?.poolInfo?.currencyInfo?.decimals || 0
        )
      );
      orgAmountValue = dividedBy(
        orgAmountValue,
        minus(1, feeData?.solvbtcFee ?? 0)
      );

      const amount = inputValue
        ? hideMantissa(
            toFixed(
              orgAmountValue,
              1,
              btcPoolInfo?.btcPoolInfo?.poolInfo?.currencyInfo?.decimals || 0
            )
          )
        : "";

      setBaseTokenAmount(amount);
    }
  };

  const noBalance = useMemo(() => {
    return Number(baseTokenAmount) > Number(baseBalance);
  }, [baseTokenAmount, baseBalance]);

  return (
    <div>
      <div className="relative">
        <Card
          className={classNames(
            "mb-2 border border-solid border-transparent focus-within:border-mainColor transition-colors",
            {
              "!border-red-500": noBalance
            }
          )}
        >
          <div className="text-xs font-MatterSQ-Regular text-grayColor">
            You Withdraw
          </div>
          <div className="w-full flex items-center my-2 gap-2">
            <div className="flex-1 outline-none bg-transparent text-2xl">
              <input
                className="w-full outline-none bg-transparent text-2xl"
                type="text"
                placeholder="0.00"
                value={baseTokenAmount}
                onChange={withdrawChange}
              />
            </div>
            <div
              className={classNames(
                "flex items-center gap-1 rounded-[6px] px-3 py-2 flex-shrink-0",
                {
                  "bg-white/10": mode === "dark",
                  "bg-black/10": mode === "light"
                }
              )}
            >
              {btcPoolInfo?.btcPoolInfo?.wrappedTokenInfo ? (
                <>
                  <Image
                    src={GET_TOKEN_ICON(
                      btcPoolInfo?.btcPoolInfo?.wrappedTokenInfo?.symbol
                    )}
                    alt={"BTC+"}
                    width={14}
                    height={14}
                  />
                  <span className="text-xs">
                    {btcPoolInfo?.btcPoolInfo?.wrappedTokenInfo?.symbol}
                  </span>
                </>
              ) : (
                <Skeleton className="w-10 h-4" />
              )}
            </div>
          </div>
          <div className="flex items-center justify-end gap-2">
            {baseBalanceStatus === "success" ? (
              <>
                <span
                  className={classNames("text-grayColor text-xs", {
                    "text-red-500": noBalance
                  })}
                >
                  Balance: {formatNumber(restrictDecimals(baseBalance, 6))}
                </span>
                <span className="text-xs text-mainColor" onClick={maxFun}>
                  Max
                </span>
              </>
            ) : (
              <Skeleton className="w-20 h-4" />
            )}
          </div>
        </Card>

        <div className="flex items-center justify-center absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="0.5"
              y="0.5"
              width="31"
              height="31"
              rx="3.5"
              fill={mode === "dark" ? "#4d4d4d" : "#F5F5F5"}
            />
            <rect
              x="0.5"
              y="0.5"
              width="31"
              height="31"
              rx="3.5"
              stroke={mode === "dark" ? "#4d4d4d" : "#D6D6D6"}
            />
            <path
              d="M16 9V23"
              stroke={mode === "dark" ? "#ffffff" : "#202020"}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M23 16L16 23L9 16"
              stroke={mode === "dark" ? "#ffffff" : "#202020"}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <Card
          className={classNames(
            "border border-solid border-transparent focus-within:border-mainColor transition-colors",
            {
              "!border-red-500": noBalance
            }
          )}
        >
          <div className="text-xs font-MatterSQ-Regular text-grayColor">
            You Receive
          </div>
          <div className="flex items-center justify-between my-2 gap-4">
            <div className="flex-1 outline-none bg-transparent text-2xl">
              <input
                className="w-full outline-none bg-transparent text-2xl"
                type="text"
                placeholder="0.00"
                value={targetTokenAmount}
                onChange={receiveChange}
              />
            </div>
            <div
              className={classNames(
                "flex items-center gap-1 rounded-[6px] px-3 py-2 flex-shrink-0",
                {
                  "bg-white/10": mode === "dark",
                  "bg-black/10": mode === "light"
                }
              )}
            >
              {btcPoolInfo?.btcPoolInfo?.poolInfo?.currencyInfo ? (
                <>
                  <Image
                    src={GET_TOKEN_ICON(
                      btcPoolInfo?.btcPoolInfo?.poolInfo?.currencyInfo?.symbol
                    )}
                    alt={"BTC+"}
                    width={14}
                    height={14}
                  />
                  <span className="text-xs">
                    {btcPoolInfo?.btcPoolInfo?.poolInfo?.currencyInfo?.symbol}
                  </span>
                </>
              ) : (
                <Skeleton className="w-10 h-4" />
              )}
            </div>
          </div>
          <div className="text-grayColor text-xs text-right flex items-center justify-end">
            {targetBalanceStatus === "success" ? (
              <>Balance: {formatNumber(restrictDecimals(targetBalance, 6))}</>
            ) : (
              <Skeleton className="w-20 h-4" />
            )}
          </div>
        </Card>
      </div>

      <div className="flex flex-col gap-2 text-[14px] mt-4">
        <div className="flex items-center justify-between">
          <span className="text-grayColor">Exchange Rate</span>
          {feeData ? (
            <div>
              1.00 {btcPoolInfo?.btcPoolInfo?.wrappedTokenInfo?.symbol} ={" "}
              {exchangeRate}{" "}
              {btcPoolInfo?.btcPoolInfo?.poolInfo?.currencyInfo?.symbol}
            </div>
          ) : (
            <Skeleton className="w-40 h-4" />
          )}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-grayColor">Redemption Fee</span>
          {feeData ? (
            <div>{feeData?.solvbtcFee * 100}%</div>
          ) : (
            <Skeleton className="w-40 h-4" />
          )}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-grayColor">Points Rewards</span>
          {btcPoolInfo?.btcPoolInfo?.poolInfo?.pointRatio ? (
            <div className="flex items-center gap-[2px]">
              <span>{btcPoolInfo?.btcPoolInfo?.poolInfo?.pointRatio}</span>
              <span>X/BTC</span>
            </div>
          ) : (
            <Skeleton className="w-20 h-4" />
          )}
        </div>
      </div>

      {isConnected ? (
        <>
          {allowanceStatus === "success" ? (
            <>
              {noBalance ? (
                <Button className="!w-full !rounded-full !h-10 !mt-4" disabled>
                  <span className="text-gray-500">
                    <span className="text-[16px] font-MatterSQ-Regular">
                      Insufficient wallet balance
                    </span>
                  </span>
                </Button>
              ) : (
                <>
                  {Number(allowedAmount) ? (
                    <Button
                      className="!w-full bg-transparent !rounded-full !h-10 !mt-4 !bg-mainColor"
                      onClick={withdrawFun}
                      loading={withdrawPending || withdrawLoading}
                    >
                      <span className="text-[16px] font-MatterSQ-Regular">
                        Withdraw
                      </span>
                    </Button>
                  ) : (
                    <Button
                      className="!w-full bg-transparent !rounded-full !h-10 !mt-4 !bg-mainColor"
                      onClick={approveFun}
                      loading={approvePending || approveLoading}
                    >
                      <span className="text-[16px] font-MatterSQ-Regular">
                        Approve
                      </span>
                    </Button>
                  )}
                </>
              )}
            </>
          ) : (
            <Skeleton className="w-full h-10 !rounded-full mt-4" />
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
  );
};

export default Withdraw;
