import { gql } from '@apollo/client';

export const PointSysBindReg = gql`
  mutation Phase2PointSysBindReg(
    $address: String
    $inviteCode: String
    $twitterAuthCode: String
    $signature: String
    $accountType: String
    $chainId: Int
    $safeMessageHash: String
  ) {
    phase2PointSysBindReg(
      binRegInput: {
        address: $address
        inviteCode: $inviteCode
        twitterAuthCode: $twitterAuthCode
        signature: $signature
        accountType: $accountType
        chainId: $chainId
        safeMessageHash: $safeMessageHash
      }
    ) {
      address
      isRegistered
      inviteCode
      inviteCount
      totalPointsEarned
      availablePoints
      isPointsAccelerationActive
      todayHoldingTVL
      todayHoldingAccelerationRatio
      nextLevelHoldingTVL
      nextLevelHoldingAccelerationRatio
    }
  }
`;
