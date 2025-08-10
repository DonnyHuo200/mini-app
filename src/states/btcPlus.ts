import { create } from "zustand";
import { persist } from "zustand/middleware";

import { persistConfig } from "./config";

interface useBtcPlusStore {
  time: number;
  updateTime: (data: number) => void;
  btcPlusStats: any;
  updateBtcPlusStats: (data: any) => void;
}

const useBtcPlusStore = create<useBtcPlusStore>()(
  persist(
    (set) => ({
      time: 0,
      updateTime: (data: number) => set({ time: data }),
      btcPlusStats: {},
      updateBtcPlusStats: (data: any) => set({ btcPlusStats: data })
    }),
    persistConfig("btcPlus-storage")
  )
);

export default useBtcPlusStore;
