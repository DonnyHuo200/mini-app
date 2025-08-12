"use client";

import {
  Button,
  Card,
  ChevronDownIcon,
  DropdownMenu,
  Flex,
  Skeleton
} from "@radix-ui/themes";
import {
  formatNumber,
  GET_TOKEN_ICON,
  handleDepositExchangeRate,
  restrictDecimals
} from "@/lib";
import {
  useAccount,
  useConnect,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract
} from "wagmi";
import {
  dividedBy,
  getCurrentTimestamp,
  hideMantissa,
  minus,
  multipliedBy,
  outputTokenAmount,
  plus,
  toFixed
} from "@/lib/utils";
import BigNumber from "bignumber.js";
import classNames from "classnames";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Address, erc20Abi, formatUnits, maxUint256, parseUnits } from "viem";

import { GetPoolCurrenciesQuery } from "@/graphql/queries/pools";
import { useQuery } from "@apollo/client";
import { useSolvBtcStore, useStore } from "@/states";
import { CheckIcon } from "@radix-ui/react-icons";
import { getSolvBTCFee } from "@/graphql/queries/solvbtc";
import depositAbiV1 from "@/abi/btc+/depositV1.json";
import depositAbiV2 from "@/abi/btc+/depositV2.json";

const Deposit = ({ btcPoolInfo }: { btcPoolInfo: any }) => {
  const { mode } = useSolvBtcStore();

  const {
    setTradingResultInfo,
    setTradingOpen,
    setTradingResultOpen,
    setTradingResultTitle,
    setTradingHash,
    setTradingInfo
  } = useStore();

  const { data: poolCurrencies } = useQuery(GetPoolCurrenciesQuery, {
    variables: {
      poolId: btcPoolInfo?.btcPoolInfo?.poolInfo?.poolOrderInfo?.poolId
    },
    skip: !btcPoolInfo?.btcPoolInfo?.poolInfo?.poolOrderInfo?.poolId
  });

  const [selectedCurrency, setSelectedCurrency] = useState<any>(null);

  useEffect(() => {
    if (poolCurrencies?.getPoolCurrencies?.currencies) {
      setSelectedCurrency(poolCurrencies?.getPoolCurrencies?.currencies[0]);
    }
  }, [poolCurrencies]);

  const { address, isConnected } = useAccount();

  const { connect, connectors } = useConnect();

  // get base balance
  const { data: baseBalanceOf, status: baseBalanceStatus } = useReadContract({
    abi: erc20Abi,
    address: selectedCurrency?.currencyAddress,
    functionName: "balanceOf",
    args: [address as Address],
    query: {
      enabled: !!selectedCurrency?.currencyAddress && !!address
    }
  });

  const baseBalance = useMemo(() => {
    return formatUnits(baseBalanceOf || BigInt(0), selectedCurrency?.decimals);
  }, [baseBalanceOf, selectedCurrency?.decimals]);

  const {
    data: targetBalanceOf,
    refetch: refetchBalance,
    status: targetBalanceStatus
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

  // get target balance
  const targetBalance = useMemo(() => {
    return formatUnits(
      targetBalanceOf || BigInt(0),
      btcPoolInfo?.btcPoolInfo?.wrappedTokenInfo?.decimals
    );
  }, [targetBalanceOf, btcPoolInfo?.btcPoolInfo?.wrappedTokenInfo?.decimals]);

  // get allowed amount
  const {
    data: allowedAmountOf,
    refetch: refetchAllowance,
    status: allowanceStatus
  } = useReadContract({
    abi: erc20Abi,
    address: selectedCurrency?.currencyAddress,
    functionName: "allowance",
    args: [
      address as Address,
      btcPoolInfo?.btcPoolInfo?.routerContract?.contractAddress
    ]
  });

  const allowedAmount = useMemo(() => {
    return formatUnits(
      allowedAmountOf || BigInt(0),
      selectedCurrency?.decimals
    );
  }, [allowedAmountOf, selectedCurrency?.decimals]);

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
      address: selectedCurrency?.currencyAddress as Address,
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
  const { data: feeData, refetch: refetchFee } = useQuery(getSolvBTCFee, {
    variables: {
      poolId: btcPoolInfo?.btcPoolInfo?.poolInfo?.poolOrderInfo?.poolId,
      symbol: selectedCurrency?.symbol
    },
    skip:
      !selectedCurrency?.symbol &&
      !btcPoolInfo?.btcPoolInfo?.poolInfo?.poolOrderInfo?.poolId
  });

  // get exchange rate
  const exchangeRate = useMemo(() => {
    return handleDepositExchangeRate(
      feeData?.solvbtcFee,
      btcPoolInfo?.btcPoolInfo?.poolInfo?.nav,
      btcPoolInfo?.btcPoolInfo?.poolInfo?.currencyInfo?.decimals
    );
  }, [
    feeData?.solvbtcFee,
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

  // deposit
  const isUpgradedRouterV2 = useMemo(() => {
    return btcPoolInfo?.btcPoolInfo?.poolInfo?.isUpgradedRouterV2;
  }, [btcPoolInfo?.btcPoolInfo?.poolInfo?.isUpgradedRouterV2]);

  const {
    writeContract: depositWriteContract,
    isPending: depositPending,
    data: depositDataHash,
    reset: resetDepositWrite
  } = useWriteContract();

  const depositFun = async () => {
    const expireTime = Number(plus(getCurrentTimestamp(), "3600"));

    await depositWriteContract({
      abi: isUpgradedRouterV2 ? depositAbiV2 : depositAbiV1,
      address: btcPoolInfo?.btcPoolInfo?.routerContract?.contractAddress,
      functionName: "deposit",
      args: isUpgradedRouterV2
        ? [
            btcPoolInfo?.btcPoolInfo?.wrappedTokenInfo?.tokenAddress,
            selectedCurrency?.currencyAddress,
            parseUnits(baseTokenAmount, selectedCurrency?.decimals),
            parseUnits(
              targetTokenAmount,
              btcPoolInfo?.btcPoolInfo?.wrappedTokenInfo?.decimals
            ),
            expireTime
          ]
        : [
            btcPoolInfo?.btcPoolInfo?.wrappedTokenInfo?.tokenAddress,
            selectedCurrency?.currencyAddress,
            parseUnits(baseTokenAmount, selectedCurrency?.decimals)
          ]
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

  useEffect(() => {
    if (approveSuccess) {
      console.info("Approve Success");
      resetDepositWrite();
      refetchBalance();
    }

    if (depositLoading) {
      setTradingOpen(true);
      setTradingHash(depositDataHash);
      setTradingInfo(
        `You are depositing ${formatNumber(baseTokenAmount)} ${
          selectedCurrency?.symbol
        }`
      );
    }

    if (depositError) {
      console.error("Deposit Error");
    }
    if (depositSuccess) {
      setTradingOpen(false);
      setTradingResultTitle("Deposited successfully");
      setTradingResultInfo(
        `You successfully deposited ${formatNumber(baseTokenAmount)} ${
          selectedCurrency?.symbol
        }`
      );
      setTradingResultOpen(true);
    }
  }, [
    setTradingOpen,
    setTradingHash,
    setTradingInfo,
    resetDepositWrite,
    refetchBalance,
    depositLoading,
    depositError,
    depositSuccess
  ]);

  const depositChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;
    inputValue = inputValue.replace(/[^0-9.]/g, "");
    inputValue = inputValue.replace(/(\..*)\./g, "$1");
    const parts = inputValue.split(".");
    if (parts[1] && parts[1].length > selectedCurrency?.decimals) {
      inputValue = `${parts[0]}.${parts[1].slice(
        0,
        selectedCurrency?.decimals
      )}`;
    }
    setBaseTokenAmount(inputValue);
    if (inputValue === "" || inputValue == ".") {
      setTargetTokenAmount("");
    } else {
      setTargetTokenAmount(
        hideMantissa(
          toFixed(
            dividedBy(
              multipliedBy(inputValue, minus(1, feeData?.solvbtcFee ?? 0)),
              outputTokenAmount(
                btcPoolInfo?.btcPoolInfo?.poolInfo?.nav || 1,
                btcPoolInfo?.btcPoolInfo?.poolInfo?.currencyInfo?.decimals ?? 0
              )
            ),
            1,
            btcPoolInfo?.btcPoolInfo?.poolInfo?.currencyInfo?.decimals || 18
          )
        )
      );
    }
  };

  const maxFun = () => {
    setBaseTokenAmount(baseBalance);
    setTargetTokenAmount(
      hideMantissa(
        toFixed(
          dividedBy(
            multipliedBy(baseBalance, minus(1, feeData?.solvbtcFee ?? 0)),
            outputTokenAmount(
              btcPoolInfo?.btcPoolInfo?.poolInfo?.nav || 1,
              btcPoolInfo?.btcPoolInfo?.poolInfo?.currencyInfo?.decimals ?? 0
            )
          ),
          1,
          btcPoolInfo?.btcPoolInfo?.poolInfo?.currencyInfo?.decimals || 18
        )
      )
    );
  };

  const receiveChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    setTargetTokenAmount(inputValue);

    if (inputValue === "" || inputValue == ".") {
      setBaseTokenAmount("");
    } else {
      const amount = multipliedBy(
        inputValue,
        outputTokenAmount(
          btcPoolInfo?.btcPoolInfo?.poolInfo?.nav || 1 * 1e18,
          btcPoolInfo?.btcPoolInfo?.poolInfo?.currencyInfo?.decimals ?? 0
        )
      );

      setBaseTokenAmount(
        hideMantissa(
          toFixed(
            dividedBy(amount, minus(1, feeData?.solvbtcFee ?? 0)),
            1,
            selectedCurrency?.decimals ?? 0
          )
        )
      );
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
            You Deposit
          </div>
          <div className="w-full flex items-center my-2 gap-2">
            <div className="flex-1 outline-none bg-transparent text-2xl">
              <input
                className="w-full outline-none bg-transparent text-2xl"
                type="text"
                placeholder="0.00"
                value={baseTokenAmount}
                onChange={depositChange}
              />
            </div>

            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                <div
                  className={classNames(
                    "flex items-center gap-1 rounded-[6px] px-3 py-2 flex-shrink-0",
                    {
                      "bg-white/10": mode === "dark",
                      "bg-black/10": mode === "light"
                    }
                  )}
                >
                  {selectedCurrency ? (
                    <>
                      <Image
                        src={GET_TOKEN_ICON(selectedCurrency?.symbol)}
                        alt={selectedCurrency?.symbol}
                        width={14}
                        height={14}
                      />
                      <span className="text-xs">
                        {selectedCurrency?.symbol}
                      </span>
                      <ChevronDownIcon className="w-2 h-2 ml-1" />
                    </>
                  ) : (
                    <Skeleton className="w-10 h-4" />
                  )}
                </div>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content align="end">
                {poolCurrencies?.getPoolCurrencies?.currencies &&
                  poolCurrencies?.getPoolCurrencies?.currencies?.map(
                    (currency: any) => (
                      <DropdownMenu.Item
                        className="!px-2"
                        key={currency.currencyAddress}
                        onClick={() => {
                          setSelectedCurrency(currency);
                          refetchFee();
                        }}
                      >
                        <Image
                          src={GET_TOKEN_ICON(currency.symbol)}
                          alt={currency.symbol}
                          width={16}
                          height={16}
                        />
                        <span className="text-sm">{currency.symbol}</span>
                        {selectedCurrency?.currencyAddress ===
                          currency.currencyAddress && (
                          <CheckIcon className="text-mainColor w-5 h-5" />
                        )}
                      </DropdownMenu.Item>
                    )
                  )}
              </DropdownMenu.Content>
            </DropdownMenu.Root>
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
          <div className="text-grayColor text-xs text-right flex items-center justify-end">
            {targetBalanceStatus === "success" ? (
              <> Balance: {formatNumber(restrictDecimals(targetBalance, 6))}</>
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
              1.00 {selectedCurrency?.symbol} = {exchangeRate}{" "}
              {btcPoolInfo?.btcPoolInfo?.wrappedTokenInfo?.symbol}
            </div>
          ) : (
            <Skeleton className="w-40 h-4" />
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-grayColor">Deposit Fee</span>
          {feeData ? (
            <div>
              {totalFee} {selectedCurrency?.symbol} ({feeData?.solvbtcFee * 100}
              %)
            </div>
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

      <>
        {isConnected ? (
          <>
            {allowanceStatus === "success" ? (
              <>
                {noBalance ? (
                  <Button
                    className="!w-full !rounded-full !h-10 !mt-4"
                    disabled
                  >
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
                        onClick={depositFun}
                        loading={depositPending || depositLoading}
                      >
                        <span className="text-[16px] font-MatterSQ-Regular">
                          Deposit
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
      </>
    </div>
  );
};

export default Deposit;
