import { gql } from '@apollo/client';

export const EligibilityCheck = gql`
  query EligibilityCheck($address: String!, $rewardType: String) {
    eligibilityCheck(address: $address, rewardType: $rewardType) {
      totalPoints
      userType
      chainId
      tokenAddress
      signer
      stagesInfo {
        stageNo
        rewardType
        totalClaimable
        pointSysReward
        earlyUserReward
        campaignReward
        baseBtcAmount
        averageHoldingAmount
        claimableBeginTime
        startTime
        endTime
        expireTime
        nonce
        signature
        state
      }
    }
  }
`;
