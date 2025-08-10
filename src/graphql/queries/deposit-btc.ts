import { gql } from '@apollo/client';

export const DepositBTCMainnetInfo = gql`
  query BTCMainnetInfo {
    btcMainnetInfo {
      depositAddress
      depositNetwork
    }
  }
`;

export const IsBtcWhitelist = gql`
  query IsBtcWhitelist($walletAddress: String!) {
    isBtcWhitelist(walletAddress: $walletAddress)
  }
`;

export const QueryBtcWhitelistInfo = gql`
  query BtcWhitelistInfo($walletAddress: String!) {
    btcWhitelistInfo(walletAddress: $walletAddress) {
      isBtcWhitelist
      btcDepositPlatForm
      btcDepositAddress
    }
  }
`;
