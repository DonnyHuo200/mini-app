import { gql } from '@apollo/client';
export const GET_ASSETS_PORTFOLIO_GRAPHQL = gql`
  query AssetsQuery($filter: AssetFilter, $pagination: Pagination, $sort: Sort) {
    assets(filter: $filter, pagination: $pagination, sort: $sort) {
      totalCount
      assetsInfo {
        id
        holder
        tokenId
        chainId
        imageUri
        balance
        bondId
        isTransferable
        contractAddress
        productInfo {
          slot
          name
          symbol
          contractInfo {
            contractAddress
            decimals
            chainId
          }
        }
        rate
        isInterestRateSet
        term
        valueDate
        maturityDate
        productType
        interestType
        currenyInfo {
          symbol
          currencyAddress
          decimals
        }
        subtype
        nav
        poolId
        poolSlotInfoId
        redeemState
        redemptionPeriod
        erc20TokenAddress
        isYieldPool
        routerContractAddress
        usdValue
        routerVersion
        yieldType
      }
    }
  }
`;

export const GET_ASSETS_ACTIVITIES_GRAPHQL = gql`
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
        tokenId
        # 交易类型，sale transfer  issue …
        transactionType
        slot
        currencySymbol
        currencyDecimals
        blockTimestamp
        productType
      }
    }
  }
`;

export const GET_ProductNames = gql`
  query ProductNames($address: String) {
    productNames(address: $address)
  }
`;

export const GET_ProductNamesForActivity = gql`
  query ProductNamesForActivity($address: String) {
    productNamesForActivity(address: $address)
  }
`;

export const GET_AssetCount = gql`
  query AssetCount($address: String) {
    assetsCount(address: $address) {
      productType
      count
    }
  }
`;

export const GET_AssetsByHolder = gql`
  query AssetsByHolder($holder: String) {
    assetsByHolder(holder: $holder) {
      totalBalanceUSD
      assetsInfo {
        poolId
        balance
      }
    }
  }
`;
