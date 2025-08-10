import { gql } from '@apollo/client';
export const GET_USER_GRAPQL = gql`
  query GetUser($name: String!) {
    getUser(name: $name) {
      login
      id
    }
  }
`;
