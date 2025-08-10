import { gql } from '@apollo/client';
export const GET_Issuances_GRAPQL = gql`
  query Issuances($filter: IssuanceFilter, $pagination: Pagination, $sort: Sort) {
    issuances(filter: $filter, pagination: $pagination, sort: $sort) {
      totalCount
      bondsInfo {
        id
        isTransferable
        productInfo {
          slot
          name
          chainId
          createTxHash
          description
          txStatus
          contractInfo {
            decimals
            contractAddress
            name
            productType
          }
          tags {
            tag
          }
          image
        }
        issuerInfo {
          id
          accountInfo {
            username
            address
            avatar
          }
        }
        issuances {
          startSaleTime
          endSaleTime
          receivingAddress
          isWhitelisted
          priceInfo
          minBuyLimit
          maxBuyLimit
          whitelist
          # auditStatus
        }
        interestType
        convertibility
        creditType
        currencyInfo {
          currencyAddress
          decimals
          symbol
        }
        term
        couponRate
        valueDate
        maturityDate
        issueSize
        totalValue
        isTransferable
        expectedToPay
        repaidValue
        repayInfos {
          address
        }
        extraInfo
        fundType
        showNav
        supervisorInfo {
          name
          label
          address
          chainId
          state
        }
        carriedInterest
        isInterestRateSet
        createdAt
        updatedAt
      }
    }
  }
`;
export const GET_Roadshow_GRAPQL = gql`
  query Roadshow($filter: RoadshowFilter, $pagination: Pagination, $sort: Sort) {
    roadshows(filter: $filter, pagination: $pagination, sort: $sort) {
      totalCount
      roadshowsInfo {
        id
        chainId
        roadshowType
        from
        creator
        amount
        currencySymbol
        targetApr
        description
        createdAt
        updatedAt
      }
    }
  }
`;

export const GET_Stable_Coins = gql`
  query Stablecoins {
    stableCoins
  }
`;

export const marketContractQuery = gql`
  query MarketContract($chainId: Int, $contractAddress: String) {
    marketContract(chainId: $chainId, contractAddress: $contractAddress) {
      decimals
      defautFeeRate
      marketContractAddress
    }
  }
`;

/**
 * 查询 OpenFund market data
 */
export const openFundPoolQuery = gql`
  query Pools($filter: PoolFilter, $pagination: Pagination, $sort: Sort) {
    pools(filter: $filter, pagination: $pagination, sort: $sort) {
      totalCount
      poolsInfo {
        id
        productInfo {
          slot
          contractInfo {
            contractAddress
          }
        }
        issuerInfo {
          accountInfo {
            address
          }
        }
        poolOrderInfo {
          subscribeMin
          subscribeMax
          subscribeNavManager
        }
        supervisorInfo {
          address
        }
        currencyInfo {
          currencyAddress
          decimals
        }
        fundType
        interestType
        maturityDate
        redemptionPeriod
        isTransferable
        totalAmount
        createdAt
        updatedAt
      }
    }
  }
`;

export const GET_Stats = gql`
  query Stats {
    stats {
      totalAssetsValue
      totalProducts
      totalUsers
    }
  }
`;
