import { gql } from '@apollo/client';

export const GET_STAKINGSTATS_GRAPQL = gql`
  query StakingStats($poolId: String!, $stageNo: Int!) {
    stakingStats(poolId: $poolId, stageNo: $stageNo) {
      stakingTvl
      totalStakingRewards
      airdropRewards
      currentTotalStakingPower
      stakingAPR
      startDate
      endDate
    }
  }
`;

export const GET_ESTIMATEREWARDS_GRAPQL = gql`
  query EstimatedRewards($address: String!, $stageNo: Int!) {
    estimatedRewards(address: $address, stageNo: $stageNo) {
      stakingPower
      currentTotalStakingPower
      estimatedReward
    }
  }
`;
