"use client";

import Banner from "@/components/Banner";
import FAQ from "@/components/FAQ";
import useScrollToHash from "@/hooks/useScrollToHash";

import SolvBtc from "./components";

const SolvBtcPage = () => {
  const { hash } = useScrollToHash();
  return (
    <div className="pb-10">
      <Banner />
      <SolvBtc />
      <FAQ hash={hash} />
    </div>
  );
};

export default SolvBtcPage;
