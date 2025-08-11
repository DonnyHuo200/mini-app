import { create } from "zustand";
import { persist } from "zustand/middleware";

import { NavHistoryData, NavHistoryInfo } from "@/types/API";

import { persistConfig } from "./config";

interface useBtcPlusStore {
  time: number;
  updateTime: (data: number) => void;
  btcPlusStats: any;
  updateBtcPlusStats: (data: any) => void;
  navData: any;
  setNavData: (data: any) => void;
}

const useBtcPlusStore = create<useBtcPlusStore>()(
  persist(
    (set) => ({
      time: 0,
      updateTime: (data: number) => set({ time: data }),
      btcPlusStats: {},
      updateBtcPlusStats: (data: any) => set({ btcPlusStats: data }),
      navData: {
        data: {} as NavHistoryInfo,
        xAxis: [],
        series: [],
        dataItem: {} as NavHistoryData,
        weekChangeRate: "",
        isWeekIncrease: false,
        defaultData: [],
        wrappedTokenSymbol: ""
      },
      setNavData: (data: any) => set({ navData: data })
    }),
    persistConfig("btcPlus-storage")
  )
);

export default useBtcPlusStore;
