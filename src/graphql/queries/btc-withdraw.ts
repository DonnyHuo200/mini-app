import { gql } from '@apollo/client';

export const GET_isBtcRedeemWhitelist = gql`
  query isBtcRedeemWhitelist($address: String) {
    isBtcRedeemWhitelist(address: $address)
  }
`;

export const GET_BtcRedeemContract = gql`
  query GetBtcRedeemContract($chainId: Int) {
    getBtcRedeemContract(chainId: $chainId) {
      redeemContract
      solvbtcAddress
    }
  }
`;

export const BtcWithdrawHistory = gql`
  query BtcWithdrawHistory($filter: BtcRedeemFilter, $pagination: Pagination, $sort: Sort) {
    btcWithdrawHistory(filter: $filter, pagination: $pagination, sort: $sort) {
      totalCount
      records {
        id
        burnAmount
        burnHash
        fromAddress
        withdrawToAddress
        withdrawAmount
        chainId
        chainName
        state
        btcTransferHash
        withdrawTime
        completionTime
      }
    }
  }
`;
