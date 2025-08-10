import { PersistOptions, createJSONStorage } from "zustand/middleware";

export const persistConfig = <T>(name: string): PersistOptions<T> => ({
  name,
  storage: createJSONStorage(() => localStorage)
  // 可选：自定义序列化/反序列化逻辑
  // partialize: (state) => ({ ...state }), // 可选择性持久化部分状态
});
