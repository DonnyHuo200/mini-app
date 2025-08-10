"use client";

import {
  beautyAmount,
  dateFormat,
  dateUTCFormat,
  inputTokenAmount,
  isGreaterThanOrEqualTo,
  minus,
  multipliedBy,
  outputTokenAmount,
  toFixed
} from "@/lib/utils";
import BigNumber from "bignumber.js";
import ReactECharts from "echarts-for-react";
import { useImmerAtom, useSetImmerAtom } from "jotai-immer";
import { useCallback, useEffect, useRef } from "react";

import { Skeleton } from "@radix-ui/themes";
import { GET_OPENFUND_NAVS_GRAPHQL } from "@/graphql/queries/product-detail";
import { NavHistoryData, NavHistoryInfo } from "@/types/API";
import { modeThemeAtom, tipOpenAtom } from "@/states/solvbtc";
import { useOpenFundNav } from "@/hooks/useOpenFundNav";
import { useQuery } from "@apollo/client";
import { QueryBtcPlusStats } from "@/graphql/queries/btcplus";

interface IEChartsProps {
  style?: React.CSSProperties;
}

const PriceCharts = ({ style }: IEChartsProps) => {
  // const { data: navHistory, error: navError } = useQuery(
  //   GET_OPENFUND_NAVS_GRAPHQL,
  //   {
  //     variables: {
  //       filter: {
  //         navType: "Investment",
  //         assetName: "BTC+"
  //       },
  //       sort: {
  //         field: "navDate",
  //         direction: "ASC"
  //       }
  //     }
  //   }
  // );

  // console.log("navHistory", navHistory);

  const { height } = style || {};
  const instance = useRef(null);

  const [navData] = useImmerAtom(tipOpenAtom);

  const setNavData = useSetImmerAtom(tipOpenAtom);

  const [mode] = useImmerAtom(modeThemeAtom);

  const { getNavValue } = useOpenFundNav();

  const handleNavData = useCallback(
    (assetValue: any) => {
      if (assetValue.networkStatus === 7) {
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
          assetValue?.data?.navsOpenFund?.currencyDecimals
        );

        if (
          assetValue?.data?.navsOpenFund &&
          assetValue?.data?.navsOpenFund?.serialData.length > 0
        ) {
          _xAxis = assetValue?.data?.navsOpenFund?.serialData.map(
            (item: NavHistoryData) => {
              const _time = dateUTCFormat(
                new Date(item.navDate + "").getTime(),
                "MM/DD"
              );
              return _time;
            }
          );

          _series = assetValue?.data?.navsOpenFund?.serialData.map(
            (item: NavHistoryData) => {
              return `${beautyAmount({
                value: outputTokenAmount(
                  getNavValue(
                    item?.nav || "0",
                    assetValue?.data?.navsOpenFund?.currencyDecimals || 0
                  ),
                  assetValue.data.navsOpenFund.currencyDecimals || 0
                ),
                poly: false
              })} `;
            }
          );

          adjustedNavLists = assetValue?.data?.navsOpenFund.serialData.map(
            (item: NavHistoryData) => {
              const navValue = outputTokenAmount(
                getNavValue(
                  item?.nav || oneNavValue,
                  assetValue?.data?.navsOpenFund?.currencyDecimals || 0
                ),
                assetValue?.data?.navsOpenFund.currencyDecimals || 0
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

          const _length = assetValue?.data?.navsOpenFund.serialData.length;
          _dataItem = assetValue?.data?.navsOpenFund?.serialData[_length - 1];

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
          _isWeekIncrease =
            _length >= 8 ? (weekRate >= 0 ? true : false) : false;
        }

        setNavData((draft) => {
          draft.data = assetValue?.data.navsOpenFund;
          draft.xAxis = _xAxis;
          draft.series = _series;
          draft.dataItem = _dataItem;
          draft.weekChangeRate = _weekChangeRate;
          draft.isWeekIncrease = _isWeekIncrease;
          draft.defaultData = assetValue?.data?.navsOpenFund.serialData;
        });
      }
    },

    [getNavValue, setNavData]
  );

  // useEffect(() => {
  //   if (navError) {
  //     setNavData((draft) => {
  //       draft.loadFinished = true;
  //       draft.data = {} as NavHistoryInfo;
  //     });
  //   } else {
  //     if (navHistory.networkStatus === 7) {
  //       handleNavData(navHistory);
  //     }

  //     setNavData((draft) => {
  //       draft.loadFinished = true;
  //     });
  //   }
  // }, [handleNavData, setNavData, navHistory]);

  // const fetchNavsData = useCallback(async () => {
  //   setNavData((draft) => {
  //     draft.loadFinished = false;
  //   });

  //   try {
  //     const navs = await getNavHistory();
  //     if (navs.networkStatus === 7) {
  //       handleNavData(navs);
  //     }

  //     setNavData((draft) => {
  //       draft.loadFinished = true;
  //     });
  //   } catch (err) {
  //     console.log(err);
  //     setNavData((draft) => {
  //       draft.loadFinished = true;
  //       draft.data = {} as NavHistoryInfo;
  //     });
  //   }
  // }, [handleNavData, setNavData]);

  const options = {
    tooltip: {
      trigger: "axis",
      backgroundColor: mode.mode === "dark" ? "#202020" : "#fafafa",
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
              mode.mode === "dark" ? "#fafafa" : "#202020"
            };margin-bottom:0px;">
            ${beautyAmount({
              value: params[i].data,
              fixed: 4,
              mantissa: false,
              poly: false
            })} ${navData?.data?.symbol || ""}</div> `;
          }
        }
        const res = `<div id="diy_tooltip" style="background: ${
          mode.mode === "dark" ? "#202020" : "#fafafa"
        };height: 58px; min-width: 137px;font-weight: 600;padding-left: 12px;padding-right: 12px;display:flex;align-items: center;border-radius: 8px; padding-top: 12px; padding-bottom:12px;border: 1px solid #7667EB;">${resData}</div>`;
        return res;
      }
    },
    grid: {
      bottom: 0,
      // left: 60,
      containLabel: true,
      left: "left",
      top: 15,
      right: 20
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
      min: 0,
      max: 2,
      axisLabel: {
        show: true,
        formatter: function (value: number) {
          const max = Math.max(...navData.series.map((item) => Number(item)));
          const fixedTicks = [0, 1, 1.5, Number(toFixed(max + 1))];
          return fixedTicks.includes(value) ? value : "";
        }
      }
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

  return (
    <div className="h-[auto] flex-1 rounded-[12px] bg-theme-50 p-4 dark:bg-black-500 flex-col">
      <div className="flex-wrap font-MatterSQ-Regular text-[0.875rem] flex items-center justify-between">
        <p>Price Chart</p>
        <p>
          <span className="font-MatterSQ-Regular text-[0.75rem] text-gray">
            1 BTC at the start of the vault is now
          </span>
          {` ${navData?.series[navData.series.length - 1] || "--"}BTC`}
        </p>
      </div>
      <div className="mt-[0.625rem] h-[16.25rem] flex-1">
        {!navData.loadFinished ? (
          <div>
            <Skeleton width="100%" height="2rem" className="mt-2"></Skeleton>
            <Skeleton width="100%" height="2rem" className="mt-4"></Skeleton>
            <Skeleton width="100%" height="2rem" className="mt-4"></Skeleton>
            <Skeleton width="100%" height="3rem" className="mt-4"></Skeleton>
          </div>
        ) : (
          <div className="relative flex size-full">
            <ReactECharts
              ref={instance}
              option={options}
              style={{ height: height ?? "100%", width: "100%" }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PriceCharts;
