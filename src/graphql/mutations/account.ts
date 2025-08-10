import { gql } from '@apollo/client';

export const updateAvatar = gql`
  mutation UpdateAvatar($updateInput: UpdateInput) {
    updateAvatar(updateInput: $updateInput) {
      id
      address
      username
      ensName
      avatar
      isIssuer
      bio
    }
  }
`;
