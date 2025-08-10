"use client";

import useScrollToHash from "@/hooks/useScrollToHash";

import BoostRewards from "./components/boostRewards";
import BtcPlusRule from "./components/btcPlusRules";
import CurrentAllocations from "./components/currentAllocations";
import Highlights from "./components/highlights";
import Info from "./components/info";
import OnchainAddress from "./components/onchainAddress";
import Overview from "./components/overview";
import BTCTrade from "./components";

const BtcPlusPage = () => {
  useScrollToHash();

  return (
    <div>
      <Info />
      <BTCTrade />
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
