"use client";

import {
  useAccount,
  useConnect,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract
} from "wagmi";
import { formatNumber, GET_TOKEN_ICON, restrictDecimals } from "@/lib";
import BigNumber from "bignumber.js";
import classNames from "classnames";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { erc20Abi, Address, formatUnits, parseUnits, maxUint256 } from "viem";

import { ArrowDownIcon, InfoCircledIcon } from "@radix-ui/react-icons";
import { Button, Popover, Skeleton } from "@radix-ui/themes";
import { useSolvBtcStore, useStore } from "@/states";
import depositAbi from "@/abi/solvbtc/deposit.json";

const Deposit = ({
  solvBTCFee,
  btcPoolInfo
}: {
  solvBTCFee: string;
  btcPoolInfo: any;
}) => {
  const { mode } = useSolvBtcStore();

  const {
    setTradingOpen,
    setTradingHash,
    setTradingInfo,
    setTradingResultOpen,
    setTradingResultTitle,
    setTradingResultInfo
  } = useStore();

  const baseToken = useMemo(() => {
    return btcPoolInfo?.btcPoolInfo?.poolInfo?.currencyInfo;
  }, [btcPoolInfo]);

  const wrappedToken = useMemo(() => {
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
    address: baseToken?.currencyAddress as Address,
    functionName: "balanceOf",
    args: [address as Address],
    query: { enabled: !!address && !!baseToken?.currencyAddress }
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
    address: baseToken?.currencyAddress as Address,
    functionName: "allowance",
    args: [address as Address, routerContract],
    query: { enabled: !!address && !!baseToken?.currencyAddress }
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
      address: baseToken?.currencyAddress as Address,
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

  // deposit
  const {
    writeContract: depositWriteContract,
    isPending: depositPending,
    data: depositDataHash,
    reset: resetDepositWrite
  } = useWriteContract();

  const depositFun = async () => {
    console.log(
      "parseUnits(depositAmount, baseToken?.decimals)",
      parseUnits(depositAmount, baseToken?.decimals)
    );

    await depositWriteContract({
      abi: depositAbi,
      address: routerContract as Address,
      functionName: "createSubscription",
      args: [poolId, parseUnits(depositAmount, baseToken?.decimals)]
    });
  };

  const {
    isLoading: depositLoading,
    isSuccess: depositSuccess,
    error: depositError
  } = useWaitForTransactionReceipt({
    hash: depositDataHash,
    query: { enabled: !!depositDataHash }
  });

  const [depositAmount, setDepositAmount] = useState("");

  useEffect(() => {
    if (depositError) {
      console.error("Deposit Error");
    }
    if (approveSuccess) {
      console.info("Approve Success");
      resetDepositWrite();
      refetchBalance();
    }

    if (depositLoading) {
      setTradingOpen(true);
      setTradingHash(depositDataHash);
      setTradingInfo(
        `You are depositing ${formatNumber(depositAmount)} ${baseToken?.symbol}`
      );
    }

    if (depositSuccess) {
      setTradingOpen(false);
      setTradingResultTitle("Deposited successfully");
      setTradingResultInfo(
        `You successfully deposited ${formatNumber(depositAmount)} ${
          baseToken?.symbol
        }`
      );
      setTradingResultOpen(true);
    }
  }, [
    depositSuccess,
    depositLoading,
    depositError,
    resetDepositWrite,
    refetchBalance,
    approveSuccess,
    approveError,
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
    setDepositAmount(inputValue);
    if (inputValue === "" || inputValue == ".") {
      setReceiveAmount("");
    } else {
      const value = new BigNumber(inputValue);
      const fee = new BigNumber(solvBTCFee);
      const one = new BigNumber(1);
      setReceiveAmount(
        restrictDecimals(
          String(value.multipliedBy(one.minus(fee))),
          wrappedToken?.decimals
        )
      );
    }
  };

  const maxFun = () => {
    setDepositAmount(formatBalance);
    const value = new BigNumber(formatBalance);
    const fee = new BigNumber(solvBTCFee);
    const one = new BigNumber(1);
    setReceiveAmount(
      restrictDecimals(
        String(value.multipliedBy(one.minus(fee))),
        wrappedToken?.decimals
      )
    );
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
      setDepositAmount("");
    } else {
      const value = new BigNumber(inputValue);
      const fee = new BigNumber(solvBTCFee);
      const one = new BigNumber(1);
      setDepositAmount(
        restrictDecimals(
          String(value.dividedBy(one.minus(fee))),
          baseToken?.decimals
        )
      );
    }
  };

  const noBalance = useMemo(() => {
    return Number(depositAmount) > Number(formatBalance);
  }, [depositAmount, formatBalance]);

  return (
    <div className="mt-4">
      <div>
        <div className="text-xs flex justify-between items-center mb-2">
          <span>You Will Deposit</span>
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
              value={depositAmount}
              onChange={depositChange}
              placeholder="0.00"
              className="bg-transparent outline-none flex-1 text-[18px] font-bold"
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
          {solvBTCFee && (
            <Popover.Root>
              <Popover.Trigger>
                <InfoCircledIcon width={12} height={12} />
              </Popover.Trigger>
              <Popover.Content side="top" align="center">
                <div className="text-sm">
                  Deposit Fee:{" "}
                  {formatNumber(Number(depositAmount) * Number(solvBTCFee))}{" "}
                  {baseToken?.symbol} ({Number(solvBTCFee) * 100}%)
                </div>
              </Popover.Content>
            </Popover.Root>
          )}
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
                      loading={depositPending || depositLoading}
                      onClick={depositFun}
                    >
                      <span className="text-[16px] font-MatterSQ-Regular">
                        Deposit
                      </span>
                    </Button>
                  ) : (
                    <Button
                      className="!w-full bg-transparent !rounded-full !h-10 !mt-4 !bg-mainColor"
                      loading={approvePending || approveLoading}
                      onClick={approveFun}
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

export default Deposit;
