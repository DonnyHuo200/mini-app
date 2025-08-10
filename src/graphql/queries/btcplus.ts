import { gql } from '@apollo/client';

export const QueryBtcPlusAllocations = gql`
  query BtcPlusAllocations {
    btcPlusAllocations {
      tvl
      allocations {
        assetName
        percentage
        color
      }
    }
  }
`;

export const QueryBtcPlusAddresses = gql`
  query BtcPlusAddresses {
    btcPlusAddresses {
      chainId
      chainName
      tokenAddress
      oracleAddress
      vault
      color
    }
  }
`;

export const QueryBtcPlusStats = gql`
  query BtcPlusStats($stageNo: Int) {
    btcPlusStats(stageNo: $stageNo) {
      baseApy
      rewardApy
      tvl
      cap
      lastUpdatedTime
      startDate
      endDate
      currentTotalRewardPower
      totalRewards
    }
  }
`;

export const QueryBtcPlusRewardByAddress = gql`
  query BtcPlusRewardByAddress($address: String!, $stageNo: Int!) {
    btcPlusRewardByAddress(address: $address, stageNo: $stageNo) {
      balance
      balanceUSD
      rewardPower
      currentTotalRewardPower
      estimatedReward
    }
  }
`;

export const QueryDepositFee = gql`
  query DepositFee($assetName: String) {
    depositFee(assetName: $assetName) {
      maxFee
      minFee
    }
  }
`;
