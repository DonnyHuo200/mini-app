import Image from "next/image";
import { useAccount, useChainId, useChains } from "wagmi";

import { useStore } from "@/states";
import { Button } from "@radix-ui/themes";
import success from "@/assets/images/tradeSuccess.svg";

import DialogWrapper from "../Dialog";

const TradingResult = () => {
  const currentChainId = useChainId();

  const chains = useChains();

  const currentChain = chains.find((chain) => chain.id === currentChainId);

  const {
    tradingResultOpen,
    setTradingResultOpen,
    tradingResultInfo,
    tradingResultTitle,
    tradingHash
  } = useStore();

  return (
    <DialogWrapper
      className="!z-40"
      open={tradingResultOpen}
      onOpenChange={setTradingResultOpen}
      closeIcon={true}
    >
      <div className="pt-4">
        <div className="flex items-center justify-center">
          <div className="flex items-center justify-center bg-gray-500/10 rounded-full p-2 w-16 h-16 aspect-square">
            <Image src={success} alt="trading" width={36} height={36} />
          </div>
        </div>

        <div className="text-xl font-MatterSQ-Medium text-center mt-4">
          {tradingResultTitle ? tradingResultTitle : " Successfully"}
        </div>
        <div className="text-sm text-gray-500 text-center mt-1">
          {tradingResultInfo ? tradingResultInfo : ""}
        </div>

        <Button
          className="!w-full !mt-8 !h-10 !rounded-full !bg-mainColor"
          onClick={() => {
            setTradingResultOpen(false);
          }}
        >
          <span className="text-base font-MatterSQ-Regular">Comfirm</span>
        </Button>

        <div className="mt-4 flex items-center justify-center">
          <a
            href={`${currentChain?.blockExplorers?.default.url}/tx/${tradingHash}`}
            target="_blank"
            className="text-sm text-mainColor text-center "
          >
            View on Etherscan
          </a>
        </div>
      </div>
    </DialogWrapper>
  );
};

export default TradingResult;
