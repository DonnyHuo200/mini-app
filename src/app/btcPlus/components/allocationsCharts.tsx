import classNames from "classnames";
import ReactECharts from "echarts-for-react";

import { Allocation } from "@/types/API";
import { multipliedBy, toFixed } from "@/lib/utils";
import { useSolvBtcStore } from "@/states";

export const AllocationsCharts = ({
  data,
  tvl
}: {
  data: Allocation[];
  tvl: string;
}) => {
  const { mode } = useSolvBtcStore();

  const option = {
    tooltip: {
      trigger: "item",
      formatter: function (params: { name: string; value: string }) {
        return `${params.name}: (${multipliedBy(params.value, "100")}%)`;
      }
    },
    legend: {
      bottom: data.length > 3 ? -4 : 0,
      textStyle: {
        color: mode != "dark" ? "#020202" : "#ffffff"
      },
      icon: "circle",
      data: data.map((item) => item.assetName),
      width: "100%",
      right: "center",
      orient: "horizontal",
      itemWidth: 10,
      itemHeight: 10,
      itemGap: 20
    },
    graphic: {
      type: "group",
      left: "center",
      top: "34%",
      children: [
        {
          type: "text",
          left: "center",
          top: -10,
          style: {
            text: "Total",
            fontSize: 10,
            fontWeight: "bold",
            fill: "#a5a5a5",
            textAlign: "center"
          }
        },
        {
          type: "text",
          left: "center",
          top: 10,
          style: {
            text: `${tvl ? toFixed(tvl, 1, 2) : "--"} BTC+`,
            fontSize: 12,
            fill: mode === "dark" ? "#ffffff" : "#020202",
            textAlign: "center"
          }
        }
      ]
    },

    series: [
      {
        type: "pie",
        radius: data.length <= 2 ? ["44%", "66%"] : ["38%", "58%"],
        center: ["50%", "40%"],
        selectedMode: "single",
        data: data.map((item) => {
          return {
            name: item.assetName,
            value: item.percentage,
            itemStyle: { color: item.color }
          };
        }),
        label: {
          color: mode != "dark" ? "#020202" : "#ffffff",
          overflow: "break",
          position: "outside"
        },
        labelLine: {
          lineStyle: {
            color: mode != "dark" ? "#020202" : "#ffffff"
          },
          length: 10,
          length2: 7,
          smooth: true
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 0,
            shadowOffsetX: 0
          }
        }
      }
    ]
  };

  return (
    <ReactECharts
      option={option}
      className={classNames(
        "!h-[300px] w-[100%]",
        { "md:!h-[286px]": data.length > 2 },
        { "md:!h-[246px]": data.length <= 2 }
      )}
      notMerge={true}
      lazyUpdate={true}
    />
  );
};
