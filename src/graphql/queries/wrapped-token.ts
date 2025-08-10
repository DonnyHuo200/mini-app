import { gql } from '@apollo/client';

export const GetWrappedTokenQuery = gql`
  query GetWrappedToken($slot: String) {
    getWrappedToken(slot: $slot) {
      tokenAddress
      symbol
      decimals
      name
    }
  }
`;

export const GetWrappedAssetsQuery = gql`
  query WrappedAssets($filter: WrappedAssetFilter, $pagination: Pagination, $sort: Sort) {
    wrappedAssets(filter: $filter, pagination: $pagination, sort: $sort) {
      totalCount
      wrappedAssets {
        chainId
        tokenAddress
        holder
        symbol
        balance
        mintTime
        lastUpdated
        decimals
        sftAddress
        slot
        name
        nav
        routerContract
        poolId
        genesisDate
        currencyDecimals
        currencySymbol
        poolSlotInfoId
        isYieldPool
        usdValue
        fundraisingStartTime
        fundraisingEndTime
        maturityDate
        routerVersion
        yieldType
        xpoolAddress
        # valueDate
        # maturityDate
      }
    }
  }
`;

export const GetRouterContract = gql`
  query RouterContract($chainId: Int, $poolSlotInfoId: Int) {
    routerContract(chainId: $chainId, poolSlotInfoId: $poolSlotInfoId) {
      chainId
      contractAddress
    }
  }
`;
