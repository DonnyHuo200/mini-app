import { gql } from '@apollo/client';
// closeFund
export const GET_PRODUCTDETAIL_CUSTODY_GRAPHQL = gql`
  query Custody($filter: CustodyFilter, $pagination: Pagination, $sort: Sort) {
    custody(filter: $filter, pagination: $pagination, sort: $sort) {
      bondId
      custodyType
      custodyAddress
      uid
      decimals
      symbol
      serialData {
        fetchTime
        balance
      }
    }
  }
`;

// closeFund
export const GET_PRODUCTDETAIL_NAVS_GRAPHQL = gql`
  query Navs($filter: NavFilter, $pagination: Pagination, $sort: Sort) {
    navs(filter: $filter, pagination: $pagination, sort: $sort) {
      bondId
      symbol
      serialData {
        nav
        yield
        fetchDate
      }
    }
  }
`;

// closeFund + openFund
export const GET_PRODUCTDETAIL_ACTIVITY_GRAPHQL = gql`
  query Activities($filter: ActivityFilter, $pagination: Pagination, $sort: Sort) {
    activities(filter: $filter, pagination: $pagination, sort: $sort) {
      totalCount
      activitiesInfo {
        id
        chainId
        txHash
        fromAddress
        toAddress
        amount
        decimals
        productName
        # 交易类型，sale transfer  issue …
        transactionType
        slot
        currencySymbol
        currencyDecimals
        blockTimestamp

        # new: open-fund
        contractAddress
        tokenId
        lastUpdated
        nav
        poolId
        createdAt
        updatedAt
      }
    }
  }
`;

// openFund
export const GET_OPENFUND_NAVS_GRAPHQL = gql`
  query NavsOpenFund($filter: NavOpenFundFilter, $pagination: Pagination, $sort: Sort) {
    navsOpenFund(filter: $filter, pagination: $pagination, sort: $sort) {
      poolSlotInfoId
      symbol
      allTimeHigh
      currencyDecimals
      serialData {
        nav
        navDate
        adjustedNav
      }
    }
  }
`;

export const GET_OPENFUND_AUM_GRAPHQL = gql`
  query AUMS($filter: AumFilter, $pagination: Pagination, $sort: Sort) {
    aums(filter: $filter, pagination: $pagination, sort: $sort) {
      totalCount
      totalShares
      investors
      decimals
      poolSlotInfoId
      symbol
      currencyDecimals
      serialData {
        aum
        nav
        fetchDate
      }
    }
  }
`;

export const GET_OPENFUND_ASSETS_GRAPHQL = gql`
  query Allocations($chainId: Int, $contractAddress: String, $slot: String) {
    allocations(chainId: $chainId, contractAddress: $contractAddress, slot: $slot) {
      name
      percentage
      value
      color
      subcolor
    }
  }
`;
