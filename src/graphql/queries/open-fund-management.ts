import { gql } from '@apollo/client';

export const getRedemptions = gql`
  query Redemptions($filter: RedemptionFilter, $pagination: Pagination, $sort: Sort) {
    redemptions(filter: $filter, pagination: $pagination, sort: $sort) {
      totalCount
      redemptionsInfo {
        id
        poolId
        currencyInfo {
          decimals
          symbol
          currencyAddress
        }
        contractAddress
        redeemSlot
        redeemAmount
        nav
        repaidValue
        claimedAmount
        state
        startTime
        orders
        performanceFee
        createdAt
        updatedAt
      }
    }
  }
`;
