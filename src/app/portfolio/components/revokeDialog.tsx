import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract
} from "wagmi";
import { useEffect, useMemo } from "react";
import { Address, erc721Abi, formatUnits } from "viem";

import { Cross1Icon } from "@radix-ui/react-icons";
import { Button, AlertDialog } from "@radix-ui/themes";
import { formatNumber, restrictDecimals } from "@/lib";
import { useQuery } from "@apollo/client";
import { marketContractQuery } from "@/graphql/queries/issuances";
import { useStore } from "@/states";
import { V2ABI, V1ABI } from "@/abi/portfolio/revoke";

const RevokeDialog = ({
  open,
  onOpenChange,
  asset
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  asset: any;
}) => {
  const {
    setTradingOpen,
    setTradingHash,
    setTradingInfo,
    setTradingResultOpen,
    setTradingResultTitle,
    setTradingResultInfo
  } = useStore();

  const { data } = useQuery(marketContractQuery, {
    variables: {
      chainId: asset?.chainId,
      contractAddress: asset?.contractAddress
    },
    skip: !(asset?.contractAddress && asset?.chainId)
  });

  const marketContract = useMemo(() => {
    return data?.marketContract;
  }, [data]);

  // get allowance
  const { data: allowanceAddress, refetch: refetchAllowance } = useReadContract(
    {
      address: asset?.contractAddress,
      abi: erc721Abi,
      functionName: "getApproved",
      args: [asset?.tokenId]
    }
  );

  const allowance = useMemo(() => {
    return (
      allowanceAddress?.toLowerCase() ===
      asset?.routerContractAddress?.toLowerCase()
    );
  }, [allowanceAddress, asset?.routerContractAddress]);

  // approve
  const {
    writeContract: approveWriteContract,
    isPending: approvePending,
    data: dataHash,
    reset: resetApproveWrite
  } = useWriteContract();

  const approveFun = async () => {
    await approveWriteContract({
      abi: erc721Abi,
      address: asset?.contractAddress as Address,
      functionName: "approve",
      args: [asset?.routerContractAddress, asset?.tokenId]
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

  const {
    writeContract: revokeWriteContract,
    isPending: revokePending,
    data: revokeDataHash
  } = useWriteContract();

  const {
    isLoading: revokeLoading,
    isSuccess: revokeSuccess,
    error: revokeError
  } = useWaitForTransactionReceipt({
    hash: revokeDataHash,
    query: { enabled: !!revokeDataHash }
  });

  const revokeFun = async () => {
    if (
      (asset?.subtype === "DEFI_VAULT" || asset?.routerVersion === "V2") &&
      asset?.contractAddress
    ) {
      await revokeWriteContract({
        abi: V2ABI,
        address: asset?.routerContractAddress as Address,
        functionName: "cancelWithdrawRequest",
        args: [asset?.erc20TokenAddress, asset?.contractAddress, asset?.tokenId]
      });
    } else {
      await revokeWriteContract({
        abi: V1ABI,
        address: asset?.routerContractAddress as Address,
        functionName: "cancelRedemption",
        args: [asset?.poolId, asset?.tokenId]
      });
    }
  };

  useEffect(() => {
    if (revokeLoading) {
      setTradingOpen(true);
      setTradingHash(revokeDataHash);
      onOpenChange(false);
      setTradingInfo(
        `This unstaking request for ${formatNumber(
          formatUnits(asset?.balance, 18)
        )} Shares will be revoked`
      );
    }

    if (revokeError) {
      console.error("Revoke Error");
      setTradingOpen(false);
    }
    if (revokeSuccess) {
      setTradingOpen(false);
      setTradingResultTitle("Revoked successfully");
      setTradingResultInfo(
        `${formatNumber(
          formatUnits(asset?.balance, 18)
        )} Shares will be minted to your address.`
      );
      setTradingResultOpen(true);
    }
  }, [revokeLoading, revokeError, revokeSuccess, onOpenChange]);

  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Content maxWidth="450px">
        <AlertDialog.Title>
          <span className="text-xl font-MatterSQ-Regular font-bold">
            Revoke
          </span>
        </AlertDialog.Title>
        <AlertDialog.Description className="text-gray-500" size="2">
          This redemption request will be revoked.
        </AlertDialog.Description>

        <div
          className="absolute top-6 right-6"
          onClick={() => {
            onOpenChange(false);
          }}
        >
          <Cross1Icon width={16} height={16} />
        </div>

        <div className="text-sm mt-6">Revokable</div>

        <div className="text-2xl font-MatterSQ-Regular font-bold flex items-center gap-1 mt-1">
          <span>
            {formatNumber(restrictDecimals(formatUnits(asset?.balance, 18), 6))}
          </span>
          <span>Shares</span>
        </div>
        <div className="mt-8 w-full">
          {allowance ? (
            <Button
              className="!rounded-full !bg-mainColor !w-full !h-[40px]"
              onClick={revokeFun}
              loading={revokePending || revokeLoading}
            >
              <span className="text-base">Confirm</span>
            </Button>
          ) : (
            <Button
              className="!rounded-full !bg-mainColor !w-full !h-[40px]"
              onClick={approveFun}
              loading={approvePending || approveLoading}
            >
              <span className="text-base">Approve</span>
            </Button>
          )}
        </div>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
};

export default RevokeDialog;
