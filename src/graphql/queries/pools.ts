import { gql } from '@apollo/client';

export const getPoolsQuery = gql`
  query Pools($filter: PoolFilter, $pagination: Pagination, $sort: Sort) {
    pools(filter: $filter, pagination: $pagination, sort: $sort) {
      totalCount
      poolsInfo {
        id
        compositeIcon
        productInfo {
          chainId
          slot
          name
          description
          image
          contractInfo {
            chainId
            contractAddress
            decimals
            symbol
            name
            productType
          }
        }
        issuerInfo {
          accountInfo {
            address
            username
          }
        }
        poolOrderInfo {
          id
          poolId
          fundraisingAmount
          poolManager
          subscribeMin
          subscribeMax
          subscribeNavManager
          openFundShare
          openFundRedemption
          openFundShareSlot
          carryRate
          carryCollector
          hardCap
          subscribeMin
          subscribeMax
          fundraisingStartTime
          fundraisingEndTime
          vault
          navOracle
          redeemNavManager
          valueDate
          poolStatus
          auditStatus
          isUnlisted
          estimatedAprMin
          estimatedAprMax
          createTxHash
          txStatus
          softCap
          whitelist
          permissionless
          highWatermark
          latestProtocolFeeSettleTime
          marketInfo {
            protocolFeeRate
          }
          poolStrategies {
            strategyInfo {
              id
              strategy
              label
              description
              color
              icon
              subcolor
            }
          }
        }
        supervisorInfo {
          address
          name
        }
        currencyInfo {
          currencyAddress
          decimals
          symbol
        }
        nav
        apy
        aum
        aumUSD
        historyApy
        additionalRewards
        isInterestRateSet
        totalRepaidValue
        couponRate
        fundType
        interestType
        maturityDate
        redemptionPeriod
        isTransferable
        subtype
        totalAmount
        pointRatio
        isYieldPool
        yieldType
        createdAt
        updatedAt
      }
    }
  }
`;

export const getPoolsQueryForStakeDetails = gql`
  query Pools($filter: PoolFilter, $pagination: Pagination, $sort: Sort) {
    pools(filter: $filter, pagination: $pagination, sort: $sort) {
      poolsInfo {
        id
        compositeIcon
        productInfo {
          description
          chainId
        }

        poolOrderInfo {
          vault
        }
      }
    }
  }
`;

export const getBtcPoolInfoQuery = gql`
  query BtcPoolInfo($filter: PoolFilter) {
    btcPoolInfo(filter: $filter) {
      poolInfo {
        id
        productInfo {
          chainId
          slot
          contractInfo {
            chainId
            contractAddress
            decimals
            symbol
          }
          description
        }
        poolOrderInfo {
          id
          poolId
          fundraisingAmount
          poolManager
          subscribeMin
          subscribeMax
          subscribeNavManager
          openFundShare
          openFundRedemption
          openFundShareSlot
          carryRate
          carryCollector
          hardCap
          subscribeMin
          subscribeMax
          fundraisingStartTime
          fundraisingEndTime
          vault
          navOracle
          redeemNavManager
          valueDate
          poolStatus
          auditStatus
          isUnlisted
          estimatedAprMin
          estimatedAprMax
          createTxHash
          txStatus
          softCap
          whitelist
          permissionless
          highWatermark
          latestProtocolFeeSettleTime
        }
        currencyInfo {
          symbol
          decimals
          currencyAddress
        }
        nav
        fundType
        interestType
        maturityDate
        redemptionPeriod
        totalAmount
        couponRate
        isInterestRateSet
        totalRepaidValue
        manualOrder
        compositeIcon
        additionalRewards
        subtype
        pointRatio
        yieldType
        isUpgradedRouterV2
      }
      wrappedTokenInfo {
        tokenAddress
        symbol
        decimals
        name
      }
      routerContract {
        chainId
        contractAddress
      }
      xpoolAddress
    }
  }
`;

export const getLatestNavQuery = gql`
  query GetLatestNav($chainId: Int, $contractAddress: String, $poolId: String) {
    getLatestNav(chainId: $chainId, contractAddress: $contractAddress, poolId: $poolId)
  }
`;

export const openFundCarryCollectorsQuery = gql`
  query CarryCollectors($chainId: Int) {
    carryCollectors(chainId: $chainId) {
      id
      chainId
      carryCollector
      createdAt
      updatedAt
    }
  }
`;

export const GetPoolCurrenciesQuery = gql`
  query GetPoolCurrencies($poolId: String) {
    getPoolCurrencies(poolId: $poolId) {
      totalCount
      currencies {
        chainId
        poolId
        currencyAddress
        symbol
        decimals
        isSupported
      }
    }
  }
`;

export const QueryBTCStats = gql`
  query BTCStats {
    btcStats {
      totalAmount
      totalTvlUSD
      totalInvestors
      totalSolvBtcAmount
      detail {
        chainId
        slot
        symbol
        amount
        currentPrice
      }
      tvlDetail {
        chainId
        amount
        tvl
      }
    }
  }
`;

export const QuerySupportedChainsM = gql`
  query supportedChainsM {
    supportedChainsM {
      chainId
      idAndCurrency {
        poolSlotInfoId
        currencySymbol
      }
    }
  }
`;

export const QuerySupportedChains = gql`
  query supportedChains {
    supportedChains {
      chainId
      poolSlotInfoId
    }
  }
`;

export const QueryBTCStatsByChainId = gql`
  query BTCTvlByChain($chainId: Int) {
    btcTvlByChain(chainId: $chainId) {
      chainId
      tvl
      investors
    }
  }
`;

export const QueryYieldPool = gql`
  query YieldPoolInfo($fofPoolSlotInfoId: Int) {
    yieldPoolInfo(fofPoolSlotInfoId: $fofPoolSlotInfoId) {
      chainId
      poolSlotInfoId
      poolId
      tokenAddress
      routerContractAddress
      symbol
      decimals
      name
      slot
    }
  }
`;
