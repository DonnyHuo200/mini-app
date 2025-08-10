import { ReactNode, useMemo } from "react";

import { Flex, Card, Popover } from "@radix-ui/themes";
import { InfoCircledIcon } from "@radix-ui/react-icons";

const Overview = () => {
  const feesData = useMemo(() => {
    return {
      managementFee: {
        key: "Management Fee",
        label: "Management Fee",
        content: <div>0%</div>
      },
      performanceFee: {
        key: "Performance Fee",
        label: "Performance Fee",
        content: (
          <div>
            <span className="mr-[0.5rem] text-gray line-through">15%</span>0%
          </div>
        )
      },
      depositFee: {
        key: "Deposit Fee",
        label: "Deposit Fee",
        labelTip:
          "Deposit Fee (0% - 0.3%) varies based on the type of wrapped BTC and blockchain network used for your deposit.",
        content: <div>0% - 0.3%</div>
      },
      redemptionFee: {
        key: "Redemption Fee",
        label: "Redemption Fee",
        content: <div>0%</div>
      }
    } as Record<
      string,
      {
        key: string;
        label: ReactNode;
        content: ReactNode;
        labelTip?: ReactNode;
      }
    >;
  }, []);
  return (
    <Card className="!p-6 my-4 !scroll-mt-[50px]" id="overview">
      <div className="text-[24px] font-MatterSQ-Medium mb-4">Overview</div>
      <Card className="!p-6">
        <div className="h-full text-sm">
          <div className="text-[20px] font-MatterSQ-Medium mb-4">Strategy</div>
          <p>
            BTC+ is a hybrid strategy vault providing sustainable returns for
            BTC without leaving the Bitcoin ecosystem, featuring
          </p>
          <ul className="!mt-4 grid list-inside !list-disc grid-cols-1 md:grid-cols-2">
            {[
              "DEX Liquidity Provision",
              "On-chain Lending Protocols",
              "Delta-neutral Funding Rate Arbitrage",
              "Multi-chain Staking & Incentives Farming",
              "RWA Yield"
            ].map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </Card>
      <Card className="!p-6 mt-4">
        <div className="h-full text-sm">
          <div className="text-[20px] font-MatterSQ-Medium mb-4">Fees</div>
          {Object.keys(feesData).map((item) => (
            <Flex
              key={feesData[item].key}
              className="mb-[0.75rem] text-[0.875rem] leading-[1.25rem] last:mb-0"
              justify="between"
            >
              <div className="text-grayColor flex items-center gap-1">
                {feesData[item].label}
                {feesData[item].labelTip && (
                  <Popover.Root>
                    <Popover.Trigger>
                      <InfoCircledIcon className="w-3 h-3" />
                    </Popover.Trigger>
                    <Popover.Content
                      side="top"
                      align="center"
                      className="!text-sm !max-w-[300px]"
                    >
                      {feesData[item].labelTip}
                    </Popover.Content>
                  </Popover.Root>
                )}
              </div>
              <div className="font-MatterSQ-Medium">
                {feesData[item].content}
              </div>
            </Flex>
          ))}
        </div>
      </Card>
    </Card>
  );
};

export default Overview;
