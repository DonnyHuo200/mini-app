import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useChainId, useChains } from "wagmi";

import { formatAddress } from "@/lib";
import { Flex, Skeleton, Text } from "@radix-ui/themes";

const Detail: React.FC<{
  details: {
    productInfo?: { description?: string };
    poolOrderInfo?: { vault?: string };
  };
  tokenAddress: string;
}> = ({ details, tokenAddress }) => {
  const descriptionRef = useRef<HTMLDivElement>(null);

  const [showBtn, setShowBtn] = useState(false);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    if (descriptionRef.current) {
      setShowBtn(descriptionRef.current.clientHeight > 160);
    }
  }, [descriptionRef]);

  const currentChainId = useChainId();

  const chains = useChains();

  const currentChain = chains.find((chain) => chain.id === currentChainId);

  return (
    <div className="mt-4">
      <Text className="font-bold text-base">Contract Info</Text>
      <div className="flex gap-2 text-[13px] mb-6 mt-4">
        <div className="flex-1">
          <div>Vault Address</div>
          {details?.poolOrderInfo?.vault ? (
            <a
              target="_blank"
              href={`${currentChain?.blockExplorers?.default?.url}/address/${details.poolOrderInfo.vault}`}
              className="underline"
            >
              {formatAddress(details.poolOrderInfo.vault)}
            </a>
          ) : (
            <Skeleton loading className="w-20 h-4 mt-1"></Skeleton>
          )}
        </div>
        <div className="flex-1">
          <div>Token Address</div>
          {tokenAddress ? (
            <a
              target="_blank"
              href={`${currentChain?.blockExplorers?.default?.url}/address/${tokenAddress}`}
              className="underline"
            >
              {formatAddress(tokenAddress)}
            </a>
          ) : (
            <Skeleton loading className="w-20 h-4 mt-1"></Skeleton>
          )}
        </div>
      </div>
      <Text className="font-bold text-base ">Description</Text>
      <div
        className={classNames(
          "text-[13px] mt-4 overflow-hidden",
          showMore ? "h-auto" : "h-40"
        )}
      >
        <div ref={descriptionRef}>
          {details?.productInfo?.description ? (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                a: ({ ...attrs }) => <a {...attrs} target="_blank"></a>,
                ul: ({ ...attrs }) => <ul {...attrs} className="ml-4"></ul>,
                li: ({ ...attrs }) => (
                  <li {...attrs} className="list-disc"></li>
                ),
                h2: ({ ...attrs }) => (
                  <h2
                    {...attrs}
                    className="text-[14px] font-bold pt-4 pb-2"
                  ></h2>
                )
              }}
            >
              {details?.productInfo?.description}
            </ReactMarkdown>
          ) : (
            <Flex direction="column" gap="2">
              {[1, 2, 3, 4, 5, 6].map((item) => {
                return (
                  <Skeleton
                    key={item}
                    loading
                    className="w-full h-4 mt-1"
                  ></Skeleton>
                );
              })}
            </Flex>
          )}
        </div>
      </div>
      {showBtn && (
        <div
          className="text-sm pt-4 text-mainColor cursor-pointer font-bold"
          onClick={() => setShowMore(!showMore)}
        >
          {showMore ? "See less" : "See more"}
        </div>
      )}
    </div>
  );
};

export default Detail;
