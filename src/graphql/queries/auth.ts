// this is an auto generated file. This will be overwritten
import { gql } from '@apollo/client';

export const GET_lOGIN_MESSAGE = /* GraphQL */ gql`
  query loginMessage($address: String) {
    loginMessage(address: $address) {
      message
    }
  }
`;

export const CHECK_AUTH_TOKEN = gql`
  query SigVerify($sig: String) {
    sigVerify(sig: $sig)
  }
`;
