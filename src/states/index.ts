import { create } from "zustand";

import useBtcPlusStore from "./btcPlus";
import useSolvBtcStore from "./solvbtc";

interface Store {
  noticeOpen: boolean;
  setNoticeOpen: (noticeOpen: boolean) => void;
  tradingOpen: boolean;
  setTradingOpen: (tradingOpen: boolean) => void;
  tradingInfo: any;
  setTradingInfo: (tradingInfo: any) => void;
  tradingResultOpen: boolean;
  setTradingResultOpen: (tradingResultOpen: boolean) => void;
  tradingResultInfo: any;
  setTradingResultInfo: (tradingResultInfo: any) => void;
  tradingResultTitle: any;
  setTradingResultTitle: (tradingResultTitle: any) => void;
  tradingHash: any;
  setTradingHash: (tradingHash: any) => void;
}

const useStore = create<Store>((set) => ({
  noticeOpen: true,
  setNoticeOpen: (noticeOpen: boolean) => set({ noticeOpen }),

  tradingOpen: false,
  setTradingOpen: (tradingOpen: boolean) => set({ tradingOpen }),

  tradingInfo: null,
  setTradingInfo: (tradingInfo: any) => set({ tradingInfo }),

  tradingResultTitle: null,
  setTradingResultTitle: (tradingResultTitle: any) =>
    set({ tradingResultTitle }),

  tradingResultOpen: false,
  setTradingResultOpen: (tradingResultOpen: boolean) =>
    set({ tradingResultOpen }),

  tradingResultInfo: null,
  setTradingResultInfo: (tradingResultInfo: any) => set({ tradingResultInfo }),

  tradingHash: null,
  setTradingHash: (tradingHash: any) => set({ tradingHash })
}));

export { useBtcPlusStore, useSolvBtcStore, useStore };
