import { gql } from '@apollo/client';
export const SET_BOOK_GRAPQL = gql`
  mutation UpdateName($title: String, $author: String) {
    updateName(title: $title, author: $author) {
      title
      author
    }
  }
`;
