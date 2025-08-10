import { gql } from '@apollo/client';

export const YieldPoolSupportedChains = gql`
  query YieldPoolSupportedChains($yieldType: String) {
    yieldPoolSupportedChains(yieldType: $yieldType) {
      chainId
      poolSlotInfoId
      yieldType
      routerVersion
    }
  }
`;

export const QueryYieldPoolStats = gql`
  query YieldPoolStats($yieldType: String) {
    yieldPoolStats(yieldType: $yieldType) {
      yieldType
      tvl
      apy
      estimatedAprMin
      estimatedAprMax
      pointsEarned
    }
  }
`;

export const QueryDex = gql`
  query Dexs($filter: DexFilter) {
    dexs(filter: $filter) {
      chainId
      chainName
      assetName
      dexName
      tokenPair
      dexUrl
      tvl
    }
  }
`;

export const QueryBridgeData = gql`
  query Redeemables($assetName: String, $redeemAmount: String) {
    redeemables(assetName: $assetName, redeemAmount: $redeemAmount) {
      chainId
      chainName
      redeemableAmount
      curencySymbol
      bridge
    }
  }
`;

export const GetRedemptionFeeRate = gql`
  query GetRedemptionFeeRate($chainId: Int, $poolId: String) {
    getRedemptionFeeRate(chainId: $chainId, poolId: $poolId)
  }
`;

export const getBabylonRelation = gql`
  query BabylonRelation($evmAddress: String!) {
    babylonRelation(evmAddress: $evmAddress) {
      isRelation
      evmAddress
      babylonAddress
      points
    }
  }
`;

export const getSolvBTCFee = gql`
  query SolvBTCFee($poolId: String, $symbol: String) {
    solvbtcFee(poolId: $poolId, symbol: $symbol)
  }
`;
