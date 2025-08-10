import { useCallback } from "react";

import { inputTokenAmount } from "@/lib/utils";

// 处理净值 NAV

const DEFAULT_NAV = 1;
export function useOpenFundNav() {
  const getNavValue = useCallback((nav: string, decimals: number | string) => {
    const navValue = nav
      ? nav
      : inputTokenAmount(DEFAULT_NAV, Number(decimals));
    return navValue;
  }, []);

  return {
    getNavValue
  };
}
