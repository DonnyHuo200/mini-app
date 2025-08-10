import { gql } from '@apollo/client';
export const LOGIN_GRAPQL = gql`
  mutation Login($loginInput: LoginInput) {
    login(loginInput: $loginInput) {
      id
      address
      username
      bio
      avatar
      isIssuer
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_USER = gql`
  mutation CreateAccount($address: String) {
    createAccount(address: $address) {
      id
      address
      username
      ensName
      avatar
      isIssuer
      bio
      needBind
      createdAt
      updatedAt
    }
  }
`;
