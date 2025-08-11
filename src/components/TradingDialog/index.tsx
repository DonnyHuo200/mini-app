import Image from "next/image";
import { useAccount, useChainId, useChains } from "wagmi";

import { useStore } from "@/states";
import DialogWrapper from "@/components/Dialog";
import trading from "@/assets/images/trading.svg";

const TradingDialog = () => {
  const { tradingOpen, setTradingOpen, tradingInfo, tradingHash } = useStore();

  const currentChainId = useChainId();

  const chains = useChains();

  const currentChain = chains.find((chain) => chain.id === currentChainId);
  return (
    <DialogWrapper
      open={tradingOpen}
      onOpenChange={setTradingOpen}
      closeIcon={true}
      className="!z-40"
    >
      <div className="pt-4">
        <div className="flex items-center justify-center">
          <div className="flex items-center justify-center bg-gray-500/10 rounded-full p-2 w-16 h-16 aspect-square">
            <Image
              src={trading}
              alt="trading"
              width={36}
              height={36}
              className="animate-spin"
            />
          </div>
        </div>

        <div className="text-xl font-MatterSQ-Medium text-center mt-8">
          Loading
        </div>
        <div className="text-sm text-gray-500 text-center mt-1">
          {tradingInfo ? tradingInfo : "Please wait, in progress..."}
        </div>
        <div className="mt-8 flex items-center justify-center">
          <a
            href={`${currentChain?.blockExplorers?.default.url}/tx/${tradingHash}`}
            target="_blank"
            className="text-sm text-mainColor text-center"
          >
            View on Etherscan
          </a>
        </div>
      </div>
    </DialogWrapper>
  );
};

export default TradingDialog;
