"use client";

import Activity from "./components/activity";
import Holdings from "./components/holdings";
import Info from "./components/info";
import Redemptions from "./components/redemptions";

const Portfolio = () => {
  return (
    <div>
      <Info />
      <Holdings />
      <Redemptions />
      <Activity />
    </div>
  );
};

export default Portfolio;
