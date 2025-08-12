"use client";

import {
  bsc,
  polygon,
  mainnet,
  arbitrum,
  fantom,
  mantle,
  merlin,
  blast,
  bob,
  avalanche,
  base,
  coreDao
} from "wagmi/chains";
import { useEffect, useMemo, useState } from "react";
import { useAccount, useChains } from "wagmi";

import { GET_ProductNamesForActivity } from "@/graphql/queries/assets";
import { Card, CheckboxGroup, RadioGroup } from "@radix-ui/themes";
import { useQuery } from "@apollo/client";

import ActivityList from "./activityList";

const FilterChains = [
  bsc,
  polygon,
  mainnet,
  arbitrum,
  fantom,
  mantle,
  merlin,
  blast,
  bob,
  avalanche,
  base,
  coreDao,
  {
    id: 2649,
    name: "AILayer"
  }
];

const activityTypeCheckBoxs = [
  {
    id: "atcb1",
    label: "Sale",
    value: "Sale"
  },
  // {
  //   id: 'atcb2',
  //   label: 'Mint',
  //   value: 'Mint',
  // },
  {
    id: "atcb3",
    label: "Transfer",
    value: "Transfer"
  },
  // {
  //   id: 'atcb4',
  //   label: 'Split',
  //   value: 'Split',
  // },
  // {
  //   id: 'atcb5',
  //   label: 'Merge',
  //   value: 'Merge',
  // },
  {
    id: "atcb6",
    label: "Claim",
    value: "Claim"
  },
  {
    id: "atcb7",
    label: "Redeem",
    value: "Redeem"
  },
  {
    id: "atcb8",
    label: "Revoke",
    value: "Revoke"
  },
  // [Tip] TODO WrappedToken
  {
    id: "atcb9",
    label: "Stake",
    value: "Stake"
  },
  {
    id: "atcb10",
    label: "Unstake",
    value: "Unstake"
  }
];

const Filter = () => {
  const { address } = useAccount();

  const chains = useChains();

  useEffect(() => {
    const chain = chains.find((chain) => chain.id === 2649);
  }, [chains]);

  const { data } = useQuery(GET_ProductNamesForActivity, {
    variables: {
      address: address
    },
    skip: !address
  });

  const productNames = useMemo(() => {
    return data?.productNamesForActivity.filter(Boolean);
  }, [data]);

  const [activityType, setActivityType] = useState<string[]>([
    "Sale",
    "Transfer",
    "Claim",
    "Redeem",
    "Revoke",
    "Stake",
    "Unstake"
  ]);
  const [productName, setProductName] = useState<string[]>([]);
  const [network, setNetwork] = useState<string[]>([]);

  const filterNumber = useMemo(() => {
    const activityTypeLength =
      activityType.length == 7 ? 0 : activityType.length;

    return activityTypeLength + productName.length + network.length;
  }, [activityType, productName, network]);

  const clearAll = () => {
    setActivityType([
      "Sale",
      "Transfer",
      "Claim",
      "Redeem",
      "Revoke",
      "Stake",
      "Unstake"
    ]);
    setProductName([]);
    setNetwork([]);
  };

  const [filterShow, setFilterShow] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between px-6 mb-4">
        <div className="text-2xl font-MatterSQ-Medium">Activity</div>

        <div className="flex items-center gap-2">
          <div className="text-[14px] font-MatterSQ-Medium" onClick={clearAll}>
            Clear All
          </div>
          <div
            className="border border-solid border-grayColor  rounded-full px-4 py-[3px] text-[12px]"
            onClick={() => setFilterShow(!filterShow)}
          >
            Filter {filterNumber ? `: ${filterNumber}` : null}
          </div>
        </div>
      </div>
      {filterShow && (
        <Card className="!p-6 !mb-4">
          <div className="mb-4">
            <div className="text-base font-MatterSQ-Medium mb-4">
              Activity Type
            </div>
            <CheckboxGroup.Root
              name="ActivityType"
              className="!flex !flex-wrap !gap-2"
              value={activityType.length == 7 ? [] : activityType}
              onValueChange={(value: string[]) => setActivityType(value)}
            >
              <div className="flex flex-wrap flex-row gap-4">
                {activityTypeCheckBoxs.map((item) => {
                  return (
                    <CheckboxGroup.Item key={item.id} value={item.label}>
                      {item.label}
                    </CheckboxGroup.Item>
                  );
                })}
              </div>
            </CheckboxGroup.Root>
          </div>
          {productNames && productNames.length > 0 ? (
            <div>
              <div className="text-base font-MatterSQ-Medium mb-4">
                Product Name
              </div>
              <CheckboxGroup.Root
                value={productName}
                name="ProductName"
                onValueChange={(value: string[]) => setProductName(value)}
              >
                <div className="flex flex-wrap flex-row gap-4">
                  {productNames &&
                    productNames.map((item: any) => {
                      return (
                        <CheckboxGroup.Item key={item} value={item}>
                          {item}
                        </CheckboxGroup.Item>
                      );
                    })}
                </div>
              </CheckboxGroup.Root>
            </div>
          ) : null}

          <div className="mt-4">
            <div className="text-base font-MatterSQ-Medium mb-4">Network</div>
            <RadioGroup.Root
              value={network[0] ? network[0] : "all"}
              name="Network"
              defaultValue="all"
              onValueChange={(value: string) => {
                if (value === "all") {
                  setNetwork([]);
                } else {
                  setNetwork([value]);
                }
              }}
            >
              <div className="flex flex-wrap flex-row gap-4">
                <RadioGroup.Item value="all">All</RadioGroup.Item>
                {FilterChains.map((item) => {
                  return (
                    <RadioGroup.Item
                      key={item.id}
                      value={item.id.toString()}
                      className="text-sm"
                    >
                      {item.name}
                    </RadioGroup.Item>
                  );
                })}
              </div>
            </RadioGroup.Root>
          </div>
        </Card>
      )}

      <ActivityList
        activityType={activityType}
        productName={productName}
        chainId={network}
      />
    </div>
  );
};

export default Filter;
