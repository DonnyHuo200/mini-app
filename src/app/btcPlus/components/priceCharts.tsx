import {
  beautyAmount,
  dateFormat,
  dateUTCFormat,
  inputTokenAmount,
  isGreaterThanOrEqualTo,
  minus,
  multipliedBy,
  outputTokenAmount
} from "@/lib/utils";
import BigNumber from "bignumber.js";
import ReactECharts from "echarts-for-react";
import { useCallback, useEffect, useMemo, useRef } from "react";

import { GET_OPENFUND_NAVS_GRAPHQL } from "@/graphql/queries/product-detail";
import { useQuery } from "@apollo/client";
import { Card, Skeleton } from "@radix-ui/themes";
import { useBtcPlusStore, useSolvBtcStore } from "@/states";
import { useOpenFundNav } from "@/hooks/useOpenFundNav";
import { NavHistoryData } from "@/types/API";

const PriceCharts = () => {
  const { data, loading } = useQuery(GET_OPENFUND_NAVS_GRAPHQL, {
    variables: {
      filter: {
        navType: "Investment",
        assetName: "BTC+"
      },
      sort: {
        field: "navDate",
        direction: "ASC"
      }
    }
  });

  const serialData = useMemo(() => {
    return data?.navsOpenFund?.serialData ? data?.navsOpenFund?.serialData : [];
  }, [data]);

  //   const nav = useMemo(() => {
  //     return serialData[serialData?.length - 1]?.nav;
  //   }, [serialData]);

  const { getNavValue } = useOpenFundNav();

  const { navData, setNavData } = useBtcPlusStore();

  useEffect(() => {
    if (data) {
      handleNavData(data);
    }
  }, [data]);

  const handleNavData = useCallback(
    (assetValue: any) => {
      let _xAxis: string[] = [];
      let _series: string[] = [];
      let adjustedNavLists: string[] = [];
      const yieldLists: string[] = [];
      let _dataItem: NavHistoryData = {
        nav: null,
        __typename: "NavHistoryData",
        navDate: null
      } as NavHistoryData;
      let _weekChangeRate = "";
      let _isWeekIncrease = false;

      const oneNavValue = inputTokenAmount(
        1,
        assetValue?.navsOpenFund?.currencyDecimals
      );

      if (
        assetValue?.navsOpenFund &&
        assetValue?.navsOpenFund?.serialData?.length > 0
      ) {
        _xAxis = assetValue?.navsOpenFund?.serialData.map(
          (item: NavHistoryData) => {
            const _time = dateUTCFormat(
              new Date(item.navDate + "").getTime(),
              "MM/DD"
            );
            return _time;
          }
        );

        _series = assetValue?.navsOpenFund?.serialData.map(
          (item: NavHistoryData) => {
            return `${beautyAmount({
              value: outputTokenAmount(
                getNavValue(
                  item?.nav || "0",
                  assetValue?.navsOpenFund?.currencyDecimals || 0
                ),
                assetValue.navsOpenFund.currencyDecimals || 0
              ),
              poly: false
            })} `;
          }
        );

        adjustedNavLists = assetValue?.navsOpenFund.serialData.map(
          (item: NavHistoryData) => {
            const navValue = outputTokenAmount(
              getNavValue(
                item?.nav || oneNavValue,
                assetValue?.navsOpenFund?.currencyDecimals || 0
              ),
              assetValue?.navsOpenFund.currencyDecimals || 0
            );
            return `${beautyAmount({
              value: new BigNumber(navValue).toFixed(4),
              poly: false
            })} `;
          }
        );

        adjustedNavLists.forEach((item) => {
          let yieldValue = multipliedBy(minus(item, "1"), "100");
          yieldValue = new BigNumber(yieldValue).toFixed(
            isGreaterThanOrEqualTo(yieldValue, "0.01") ? 2 : 4
          );
          yieldLists.push(yieldValue);
        });

        const _length = assetValue?.navsOpenFund?.serialData?.length;
        _dataItem = assetValue?.navsOpenFund?.serialData?.[_length - 1];

        const arr = yieldLists;

        _isWeekIncrease = false;

        const weekRate =
          _length >= 8
            ? (Number(arr[arr.length - 1]) - Number(arr[arr.length - 8])) /
              (Number(arr[arr.length - 8]) == 0
                ? 1
                : Number(arr[arr.length - 8]))
            : 0;

        _weekChangeRate =
          _length >= 8 ? `${Number(weekRate * 100).toFixed(2)} %` : "";
        _isWeekIncrease = _length >= 8 ? (weekRate >= 0 ? true : false) : false;
      }

      setNavData({
        data: assetValue?.navsOpenFund,
        xAxis: _xAxis,
        series: _series,
        dataItem: _dataItem,
        weekChangeRate: _weekChangeRate,
        isWeekIncrease: _isWeekIncrease,
        defaultData: assetValue?.navsOpenFund.serialData
      });
    },

    [getNavValue, setNavData]
  );

  const { mode } = useSolvBtcStore();

  const options = {
    tooltip: {
      trigger: "axis",
      backgroundColor: mode === "dark" ? "#202020" : "#fafafa",
      borderColor: "#7667EB",
      borderWidth: 0,
      padding: 0,
      axisPointer: {
        type: "line",
        lineStyle: {
          type: "solid",
          width: 1,
          color: "#7667EB"
        }
      },
      formatter: function (params: any) {
        let resData = "";

        for (let i = 0; i < params.length; i++) {
          let date = "";
          for (let j = 0; j < navData.defaultData.length; j++) {
            const jTime = dateFormat(
              new Date(navData.defaultData[j].navDate + "").getTime(),
              "MM/DD"
            );
            if (params[i].name == jTime) {
              date = dateFormat(
                new Date(navData.defaultData[j].navDate + "").getTime(),
                "YYYY/MM/DD"
              );
            }
          }
          if (params[i].data != undefined) {
            resData += `<div style="font-size: 14px;"> <div style="color: #929292; margin-bottom: 2px;">  ${date}</div>
            <div style="color: ${
              mode === "dark" ? "#fafafa" : "#202020"
            };margin-bottom:0px;">
            ${beautyAmount({
              value: params[i].data,
              fixed: 6,
              mantissa: false,
              poly: false
            })} ${navData?.data?.symbol || ""}</div> `;
          }
        }
        const res = `<div id="diy_tooltip" style="background: ${
          mode === "dark" ? "#202020" : "#fafafa"
        };height: 58px; min-width: 137px;font-weight: 600;padding-left: 12px;padding-right: 12px;display:flex;align-items: center;border-radius: 8px; padding-top: 12px; padding-bottom:12px;border: 1px solid #7667EB;">${resData}</div>`;
        return res;
      }
    },
    grid: {
      bottom: 0,
      // left: 60,
      containLabel: true,
      top: 15,
      left: "left",
      right: 18
      // left: '5%',
      // right: '5%',
    },
    xAxis: {
      type: "category",
      data: navData.xAxis,
      boundaryGap: false,
      inverse: false,
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      }
    },
    yAxis: {
      type: "value",
      splitLine: {
        show: false,
        lineStyle: {
          color: "rgba(32, 32, 32, 0.2)",
          width: 1,
          type: "dashed"
        }
      },
      min: 1,
      // max: 2,

      scale: true,

      // min: function (value: { min: number; max: number }) {
      //   return (value.max + (value.max - value.min) * 0.2).toFixed(6);
      // },
      // max: function (value: { min: number; max: number }) {
      //   return (value.min - (value.max - value.min) * 0.2).toFixed(6);
      // },

      axisLabel: {
        show: true,
        formatter: (value: any) =>
          Number(value).toLocaleString(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 6
          })
      }

      // axisLabel: {
      //   show: true,
      //   formatter: function (value: number) {
      //     const max = Math.max(...navData.series.map((item) => Number(item)));
      //     const fixedTicks = [
      //       0,
      //       1,
      //       1.5,
      //       Number(toFixed(max + 1)),
      //     ];
      //     return fixedTicks.includes(value) ? value : '';
      //   },
      // },
    },
    series: [
      {
        type: "line",
        data: navData.series,
        showSymbol: true,
        smooth: true,
        symbol: "circle",
        symbolSize: 0,
        itemStyle: {
          color: "#7667EB",
          borderWidth: 2,
          borderColor: "rgba(255,255,255,0.6)"
        },
        emphasis: {
          itemStyle: {
            color: "#7667EB",
            borderColor: "#7667EB",
            borderWidth: 4,
            shadowBlur: 10,
            shadowColor: "rgba(143, 74, 255, 0.5)"
          }
        },

        lineStyle: {
          color: "#7667EB"
        },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "rgba(143, 74, 255, 0.2)"
              },
              {
                offset: 1,
                color: "rgba(143, 74, 255, 0.01)"
              }
            ]
          }
        },
        barMaxWidth: "10%"
        // markPoint
      }
    ]
  };

  const lastPrice = useMemo(() => {
    return navData && navData?.series[navData?.series?.length - 1];
  }, [navData]);

  return (
    <Card className="mt-4 !p-6">
      <Card>
        <div className="font-MatterSQ-Medium text-sm">Price Chart</div>

        {loading ? (
          <div>
            <Skeleton loading className="w-full h-4 mt-4"></Skeleton>
            <Skeleton loading className="w-full h-4 mt-4"></Skeleton>
            <Skeleton loading className="w-full h-4 mt-4"></Skeleton>
            <Skeleton loading className="w-full h-4 mt-4"></Skeleton>
            <Skeleton loading className="w-full h-4 mt-4"></Skeleton>
            <Skeleton loading className="w-full h-4 mt-4"></Skeleton>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 mt-2">
              <span className="font-MatterSQ-Regular text-xs text-gray">
                1 BTC at the start of the vault is now
              </span>{" "}
              <span className="font-MatterSQ-Medium text-[14px]">
                {lastPrice ? `${lastPrice} BTC` : "--"}
              </span>
            </div>

            <div className="relative size-full mt-6">
              <ReactECharts
                option={options}
                style={{ height: "200px", width: "100%" }}
              />
            </div>
          </>
        )}
      </Card>
    </Card>
  );
};

export default PriceCharts;
