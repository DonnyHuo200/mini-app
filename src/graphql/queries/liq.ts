import { gql } from '@apollo/client';
export const DefiPointRatio = gql`
  query DefiPointRatio {
    defiPointRatio {
      chainId
      chainName
      protocol
      task
      pointRatio
      url
    }
  }
`;

export const LiquidityByChain = gql`
  query LiquidityByChain($phase: Int) {
    liquidityByChain(phase: $phase) {
      chainId
      chainName
      totalTvl
      highestApy
      highestPointRatio
      url
      order
      chainReward
      description
      details {
        assetType
        chainId
        chainName
        protocol
        task
        tvl
        apy
        url
        pointRatio
        description
        extraPointsReward
        pointsRewardContent
        extraTokenReward
        tokenRewardContent
        pointsRewardTitle
        tokenRewardTitle
        boosting
        rewardInfo
        logoUrl
      }
    }
  }
`;

export const LiquidityByProtocol = gql`
  query LiquidityByProtocol($phase: Int) {
    liquidityByProtocol(phase: $phase) {
      protocol
      totalTvl
      highestApy
      highestPointRatio
      order
      details {
        chainId
        chainName
        protocol
        task
        tvl
        apy
        url
        pointRatio
        description
        extraPointsReward
        pointsRewardContent
        extraTokenReward
        tokenRewardContent
        pointsRewardTitle
        tokenRewardTitle
        boosting
      }
    }
  }
`;

export const LiquidityByAssets = gql`
  query LiquidityByAsset($phase: Int) {
    liquidityByAsset(phase: $phase) {
      assetType
      totalTvl
      highestApy
      highestPointRatio
      url
      order
      details {
        chainId
        chainName
        protocol
        task
        tvl
        apy
        url
        pointRatio
        description
        extraPointsReward
        pointsRewardContent
        extraTokenReward
        tokenRewardContent
        pointsRewardTitle
        tokenRewardTitle
        boosting
      }
    }
  }
`;

export const ProtocolList = gql`
  query ProtocolList {
    protocolList
  }
`;

export const ProtocolInfoList = gql`
  query ProtocolInfoList {
    protocolInfoList {
      protocol
      logoUrl
    }
  }
`;
