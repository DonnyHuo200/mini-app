import { useState } from "react";
import { useWalletClient } from "wagmi";

interface TokenOptions {
  address: string;
  symbol: string;
  decimals: number;
  image?: string;
}

function useAddTokenButton() {
  const { data: walletClient } = useWalletClient();

  const addToken = async (options: TokenOptions) => {
    if (!walletClient) {
      return;
    }

    try {
      const success = await walletClient.watchAsset({
        type: "ERC20",
        options
      });

      if (success) {
        console.log("success");
      } else {
        console.log("fail");
      }
    } catch (err) {
      console.log("fail");
    }
  };
  return { addToken };
}

export default useAddTokenButton;
