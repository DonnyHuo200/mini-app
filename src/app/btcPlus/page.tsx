"use client";

import { useEffect } from "react";

import { useMiniKit } from "@coinbase/onchainkit/minikit";

import BoostRewards from "./components/boostRewards";
import BtcPlusRule from "./components/btcPlusRules";
import CurrentAllocations from "./components/currentAllocations";
import Highlights from "./components/highlights";
import Info from "./components/info";
import OnchainAddress from "./components/onchainAddress";
import Overview from "./components/overview";
import PriceCharts from "./components/priceCharts";
import BTCTrade from "./components";

const BtcPlusPage = () => {
  const { setFrameReady, isFrameReady } = useMiniKit();

  // The setFrameReady() function is called when your mini-app is ready to be shown
  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  return (
    <div>
      <Info />
      <BTCTrade />
      <PriceCharts />
      <BoostRewards />
      <Overview />
      <BtcPlusRule />
      <CurrentAllocations />
      <Highlights />
      <OnchainAddress />
    </div>
  );
};

export default BtcPlusPage;
