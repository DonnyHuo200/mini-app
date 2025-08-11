"use client";

import { ReactNode } from "react";

import { useStore } from "@/states";
import Header from "@/components/Header";
import Notice from "@/components/Notice";
import TradingDialog from "@/components/TradingDialog";
import TradingResult from "@/components/TradingResult";

const BodyProvider = ({ children }: { children: ReactNode }) => {
  const { noticeOpen } = useStore();

  return (
    <div className="max-w-[500px] mx-auto">
      <Header className="max-w-[500px] mx-auto" />
      <div className="pt-[50px]">
        {noticeOpen ? <Notice /> : null}
        {children}
      </div>
      <TradingDialog />
      <TradingResult />
    </div>
  );
};

export default BodyProvider;
