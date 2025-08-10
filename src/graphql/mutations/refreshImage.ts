import { gql } from '@apollo/client';

export const RefreshImage = gql`
  mutation RefreshImage($assetId: Int) {
    refreshImage(assetId: $assetId)
  }
`;
