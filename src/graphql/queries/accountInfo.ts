import { gql } from '@apollo/client';
export const GET_ACCOUNT = gql`
  query UserAccountInfo($address: String) {
    userAccountInfo(address: $address) {
      id
      address
      username
      ensName
      avatar
      isIssuer
    }
  }
`;
