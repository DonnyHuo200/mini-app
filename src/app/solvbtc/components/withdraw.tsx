"use client";

import {
  useAccount,
  useConnect,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract
} from "wagmi";
import {
  Button,
  Callout,
  Card,
  Popover,
  Skeleton,
  Spinner,
  Text
} from "@radix-ui/themes";
import classNames from "classnames";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { erc20Abi, Address, formatUnits, parseUnits, maxUint256 } from "viem";

import { formatNumber, GET_TOKEN_ICON, restrictDecimals } from "@/lib";
import { ArrowDownIcon, InfoCircledIcon } from "@radix-ui/react-icons";
import { useSolvBtcStore, useStore } from "@/states";
import withdrawAbi from "@/abi/solvbtc/withdraw.json";

const Withdraw = ({
  redemptionFeeRate,
  btcPoolInfo
}: {
  redemptionFeeRate: string;
  btcPoolInfo: any;
}) => {
  const { mode } = useSolvBtcStore();

  const {
    setTradingResultInfo,
    setTradingOpen,
    setTradingResultOpen,
    setTradingResultTitle,
    setTradingHash,
    setTradingInfo
  } = useStore();

  const wrappedToken = useMemo(() => {
    return btcPoolInfo?.btcPoolInfo?.poolInfo?.currencyInfo;
  }, [btcPoolInfo]);

  const baseToken = useMemo(() => {
    return btcPoolInfo?.btcPoolInfo?.wrappedTokenInfo;
  }, [btcPoolInfo]);

  const routerContract = useMemo(() => {
    return btcPoolInfo?.btcPoolInfo?.routerContract?.contractAddress;
  }, [btcPoolInfo]);

  const poolId = useMemo(() => {
    return btcPoolInfo?.btcPoolInfo?.poolInfo?.poolOrderInfo?.poolId;
  }, [btcPoolInfo]);

  // get balance
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();

  const {
    data: balance,
    isLoading: isLoadingBalance,
    refetch: refetchBalance
  } = useReadContract({
    abi: erc20Abi,
    address: baseToken?.tokenAddress as Address,
    functionName: "balanceOf",
    args: [address as Address],
    query: { enabled: !!address && !!baseToken?.tokenAddress }
  });

  const formatBalance = useMemo(() => {
    return formatUnits(balance ?? BigInt(0), baseToken?.decimals);
  }, [balance, baseToken?.decimals]);

  // get allowance
  const {
    data: allowance,
    refetch: refetchAllowance,
    status: allowanceStatus
  } = useReadContract({
    abi: erc20Abi,
    address: baseToken?.tokenAddress as Address,
    functionName: "allowance",
    args: [address as Address, routerContract],
    query: { enabled: !!address && !!baseToken?.tokenAddress }
  });

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
      address: baseToken?.tokenAddress as Address,
      functionName: "approve",
      args: [routerContract, maxUint256]
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

  const [withdrawAmount, setWithdrawAmount] = useState("");

  // withdraw
  const {
    writeContract: withdrawWriteContract,
    isPending: withdrawPending,
    data: withdrawDataHash,
    reset: resetWithdrawWrite
  } = useWriteContract();

  const withdrawFun = async () => {
    await withdrawWriteContract({
      abi: withdrawAbi,
      address: routerContract as Address,
      functionName: "createRedemption",
      args: [poolId, parseUnits(withdrawAmount, baseToken?.decimals)]
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
      console.error("Deposit Error");
    }
    if (approveSuccess) {
      console.info("Approve Success");
      resetWithdrawWrite();
      refetchBalance();
    }

    if (withdrawLoading) {
      setTradingOpen(true);
      setTradingHash(withdrawDataHash);
      setTradingInfo(
        `You are withdrawing ${formatNumber(withdrawAmount)} ${
          btcPoolInfo?.btcPoolInfo?.wrappedTokenInfo?.symbol
        }`
      );
    }

    if (withdrawSuccess) {
      setTradingOpen(false);
      setTradingResultTitle("Submitted successfully");

      setTradingResultInfo(
        <>
          <p>Your redemption will be processed within 7 days.</p>
          <p>
            Check progress in 'My Portfolio' - ‘My Redemptions‘ and claim assets
            when completed.
          </p>
        </>
      );
      setTradingResultOpen(true);
    }
  }, [
    withdrawSuccess,
    approveSuccess,
    withdrawError,
    resetWithdrawWrite,
    refetchBalance,
    withdrawLoading,
    setTradingOpen,
    setTradingHash,
    setTradingInfo
  ]);

  const depositChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;
    inputValue = inputValue.replace(/[^0-9.]/g, "");
    inputValue = inputValue.replace(/(\..*)\./g, "$1");
    const parts = inputValue.split(".");
    if (parts[1] && parts[1].length > baseToken?.decimals) {
      inputValue = `${parts[0]}.${parts[1].slice(0, baseToken?.decimals)}`;
    }
    setWithdrawAmount(inputValue);
    if (inputValue === "" || inputValue == ".") {
      setReceiveAmount("");
    } else {
      setReceiveAmount(restrictDecimals(inputValue, wrappedToken?.decimals));
    }
  };

  const maxFun = () => {
    setWithdrawAmount(formatBalance);
    setReceiveAmount(restrictDecimals(formatBalance, wrappedToken?.decimals));
  };

  const [receiveAmount, setReceiveAmount] = useState("");

  const receiveChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;
    inputValue = inputValue.replace(/[^0-9.]/g, "");
    inputValue = inputValue.replace(/(\..*)\./g, "$1");
    const parts = inputValue.split(".");
    if (parts[1] && parts[1].length > wrappedToken?.decimals) {
      inputValue = `${parts[0]}.${parts[1].slice(0, wrappedToken?.decimals)}`;
    }
    setReceiveAmount(inputValue);

    if (inputValue === "" || inputValue == ".") {
      setWithdrawAmount("");
    } else {
      setWithdrawAmount(restrictDecimals(inputValue, baseToken?.decimals));
    }
  };

  const noBalance = useMemo(() => {
    return Number(withdrawAmount) > Number(formatBalance);
  }, [withdrawAmount, formatBalance]);

  return (
    <div className="mt-4">
      <div>
        <div className="text-xs flex justify-between items-center mb-2">
          <span>You Will Withdraw</span>
          <span className="flex items-center gap-1">
            <span
              className={classNames("text-gray-500", {
                "text-red-500": noBalance
              })}
            >
              Balance:
            </span>
            {isLoadingBalance ? (
              <Skeleton loading className="w-10 h-4"></Skeleton>
            ) : (
              <span
                className={classNames("pl-1", {
                  "text-red-500": noBalance
                })}
              >
                {formatNumber(restrictDecimals(formatBalance, 4))}
              </span>
            )}
          </span>
        </div>

        {baseToken ? (
          <div
            className={classNames(
              "flex items-center gap-2 bg-black h-[44px] rounded-[4px] border border-solid px-4 focus-within:border-mainColor transition-colors",
              {
                "border-gray-300 bg-white": mode === "light",
                "bg-black border-transparent": mode === "dark",
                "!border-red-500": noBalance
              }
            )}
          >
            <input
              type="text"
              value={withdrawAmount}
              onChange={depositChange}
              className="bg-transparent outline-none flex-1 text-[18px] font-bold"
              placeholder="0.00"
            />
            <button className="text-xs" onClick={maxFun}>
              Max
            </button>
            <div className="flex items-center gap-1">
              <Image
                src={GET_TOKEN_ICON(baseToken?.symbol)}
                alt=""
                width={14}
                height={14}
              ></Image>
              <span className="text-xs">{baseToken?.symbol}</span>
            </div>
          </div>
        ) : (
          <Skeleton loading className="w-full h-10 mt-1"></Skeleton>
        )}
      </div>
      <div className="flex justify-center items-center py-2">
        <ArrowDownIcon width={20} height={20} />
      </div>
      <div>
        <div className="text-xs pb-2 flex items-center gap-1">
          <span>You Will Receive</span>
          {Number(redemptionFeeRate) ? (
            <Popover.Root>
              <Popover.Trigger>
                <InfoCircledIcon width={12} height={12} />
              </Popover.Trigger>
              <Popover.Content side="top" align="center">
                <div className="text-sm">
                  Deposit Fee:{" "}
                  {formatNumber(
                    Number(withdrawAmount) * Number(redemptionFeeRate)
                  )}{" "}
                  {baseToken?.symbol} ({Number(redemptionFeeRate) * 100}%)
                </div>
              </Popover.Content>
            </Popover.Root>
          ) : null}
        </div>
        {wrappedToken ? (
          <div
            className={classNames(
              "flex items-center gap-2 bg-black h-[44px] rounded-[4px] border border-solid px-4 focus-within:border-mainColor transition-colors",
              {
                "border-gray-300 bg-white": mode === "light",
                "bg-black border-transparent": mode === "dark",
                "!border-red-500": noBalance
              }
            )}
          >
            <input
              className="bg-transparent outline-none flex-1 text-[18px] font-bold"
              type="text"
              onChange={receiveChange}
              value={receiveAmount}
              placeholder="0.00"
            />
            <div className="flex items-center gap-1">
              <Image
                src={GET_TOKEN_ICON(wrappedToken?.symbol)}
                alt=""
                width={14}
                height={14}
              ></Image>
              <span className="text-xs">{wrappedToken?.symbol}</span>
            </div>
          </div>
        ) : (
          <Skeleton loading className="w-full h-10 mt-1"></Skeleton>
        )}
      </div>
      <div className="mt-4">
        <div
          className={classNames(
            "flex items-start gap-2 rounded-lg p-3 pl-[18px]",
            {
              "bg-[#1d2129cc]": mode === "dark",
              "bg-[#7667eb33]": mode === "light"
            }
          )}
        >
          <InfoCircledIcon
            width={14}
            height={14}
            className="flex-shrink-0 text-mainColor mt-[2px]"
          />
          <div className="text-xs !leading-2">
            {`Requested token will be available to claim under ‘My Portfolio’ - ’My Redemptions‘ `}
            {`within 7 days.`}
          </div>
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
                  {allowance && Number(allowance) > 0 ? (
                    <Button
                      className="!w-full bg-transparent !rounded-full !h-10 !mt-4 !bg-mainColor"
                      disabled={withdrawPending || withdrawLoading}
                      onClick={withdrawFun}
                    >
                      {(withdrawPending || withdrawLoading) && (
                        <Spinner loading></Spinner>
                      )}
                      <span className="text-[16px] font-MatterSQ-Regular">
                        Withdraw
                      </span>
                    </Button>
                  ) : (
                    <Button
                      className="!w-full bg-transparent !rounded-full !h-10 !mt-4 !bg-mainColor"
                      disabled={approvePending || approveLoading}
                      onClick={approveFun}
                    >
                      {(approvePending || approveLoading) && (
                        <Spinner loading></Spinner>
                      )}
                      <span className="text-[16px] font-MatterSQ-Regular">
                        Approve
                      </span>
                    </Button>
                  )}
                </>
              )}
            </>
          ) : (
            <Skeleton
              loading
              className="w-full h-10 mt-4 !rounded-full"
            ></Skeleton>
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
