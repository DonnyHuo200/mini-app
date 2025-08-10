import { gql } from '@apollo/client';

export const QueryPointSysAccountInfo = gql`
  query Phase2PointSysAccountInfo($address: String) {
    phase2PointSysAccountInfo(address: $address) {
      address
      isRegistered
      seedUserInviteCode
      inviteCode
      inviteCount
      totalPointsEarned
      availablePoints
      isPointsAccelerationActive
      todayHoldingTVL
      todayHoldingAccelerationRatio
      nextLevelHoldingTVL
      nextLevelHoldingAccelerationRatio
      activityCards {
        type
        accelerationRatio
        startTime
        endTime
      }
      isHighestLevel
    }
  }
`;

export const VerifyPointSysInviteCode = gql`
  query Phase2PointSysInviteCodeVerify($inviteCode: String) {
    phase2PointSysInviteCodeVerify(inviteCode: $inviteCode)
  }
`;

export const QueryPointSysRanking = gql`
  query Phase2PointSysRanking {
    phase2PointSysRanking {
      address
      avatar
      username
      twitterUsername
      totalPointsEarned
      inviterAvatar
      inviterUsername
      inviterTwitterUsername
    }
  }
`;

export const QueryNeedRegister = gql`
  query NeedRegister($address: String) {
    needRegister(address: $address)
  }
`;

export const QueryPhase1PointSysAccountInfo = gql`
  query PointSysAccountInfo($address: String) {
    pointSysAccountInfo(address: $address) {
      totalPointsEarned
    }
  }
`;

export const QueryPhase2TotalPoints = gql`
  query TotalPoints {
    totalPoints
  }
`;
