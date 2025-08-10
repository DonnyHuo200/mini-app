import { gql } from '@apollo/client';
export const GET_LIST_GRAPQL = gql`
  query Query {
    listEvents {
      items {
        id
        name
      }
    }
  }
`;
