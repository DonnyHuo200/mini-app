import Image from "next/image";
import { useAccount, useChainId, useChains } from "wagmi";

import { QueryBtcPlusAddresses } from "@/graphql/queries/btcplus";
import { useQuery } from "@apollo/client";
import { Card, Flex, Skeleton } from "@radix-ui/themes";
import { formatAddress } from "@/lib";
import { CopyHelper } from "@/components/CopyHelper";
import shareIcon from "@/assets/images/share.svg";

const OnchainAddress = () => {
  const currentChainId = useChainId();

  const { data, loading } = useQuery(QueryBtcPlusAddresses);

  const info = data?.btcPlusAddresses.find(
    (address: { chainId: number }) => address.chainId === currentChainId
  );

  const chains = useChains();

  const currentChain = chains.find((chain) => chain.id === currentChainId);

  return (
    <Card className="!p-6 my-4">
      <div className="text-[20px] font-MatterSQ-Medium mb-4">
        Onchain Address
      </div>
      <Card className="!p-6">
        <div className="flex items-center justify-between border-b border-grayColor/20 py-3">
          <span> BTC+</span>
          {loading ? (
            <div className="flex items-center gap-1">
              <Skeleton className="w-40 h-4" />
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <CopyHelper data={info?.tokenAddress} size="1rem" fill="#7667EB">
                <Flex>{formatAddress(info?.tokenAddress)}</Flex>
              </CopyHelper>
              <a
                href={`${currentChain?.blockExplorers?.default?.url}/address/${info?.tokenAddress}`}
                target="_blank"
                rel="noreferrer"
              >
                <Image src={shareIcon} alt="share" width={16} height={16} />
              </a>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between border-b border-grayColor/20 py-3">
          <span>BTC+/SolvBTC Oracle</span>
          {loading ? (
            <div className="flex items-center gap-1">
              <Skeleton className="w-40 h-4" />
            </div>
          ) : (
            <div className="flex items-center gap-1 flex-shrink-0">
              <CopyHelper data={info?.oracleAddress} size="1rem" fill="#7667EB">
                <Flex>{formatAddress(info?.oracleAddress)}</Flex>
              </CopyHelper>
              <a
                href={`${currentChain?.blockExplorers?.default?.url}/address/${info?.tokenAddress}`}
                target="_blank"
                rel="noreferrer"
              >
                <Image src={shareIcon} alt="share" width={16} height={16} />
              </a>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between pt-3">
          <span>Vault Address</span>
          {loading ? (
            <div className="flex items-center gap-1">
              <Skeleton className="w-40 h-4" />
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <CopyHelper data={info?.vault} size="1rem" fill="#7667EB">
                <Flex>{formatAddress(info?.vault)}</Flex>
              </CopyHelper>
              <a
                href={`${currentChain?.blockExplorers?.default?.url}/address/${info?.tokenAddress}`}
                target="_blank"
                rel="noreferrer"
              >
                <Image src={shareIcon} alt="share" width={16} height={16} />
              </a>
            </div>
          )}
        </div>
      </Card>
    </Card>
  );
};

export default OnchainAddress;
