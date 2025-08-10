import { gql } from '@apollo/client';
export const QueryBridgeSupportedAssets = gql`
  query BridgeSupportedAssets {
    bridgeSupportedAssets
  }
`;

export const QueryBridgeSupportedChains = gql`
  # query BridgeSupportedChains($assetName: String!) {
  #   bridgeSupportedChains(assetName: $assetName) {
  #     chainName
  #     chainId
  #   }
  # }

  query BridgeSupportedChains($assetName: String!) {
    bridgeSupportedChains(assetName: $assetName) {
      fromChains {
        chainId
        chainName
        tokenAddress
      }
      toChains {
        chainId
        chainName
        tokenAddress
      }
    }
  }
`;

export const QueryGetSupportedBridges = gql`
  query getSupportedBridges($assetName: String!, $sourceChain: String, $targetChain: String) {
    getSupportedBridges(assetName: $assetName, sourceChain: $sourceChain, targetChain: $targetChain) {
      bridgeName
      bridgeUrl
      description
    }
  }
`;
