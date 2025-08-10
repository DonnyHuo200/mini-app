/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten
import { gql } from '@apollo/client';

export const GET_LIST_POSTS = /* GraphQL */ gql`
  query ListPosts {
    listPosts {
      id
      title
      content
    }
  }
`;
export const getPostById = /* GraphQL */ gql`
  query GetPostById($postId: String!) {
    getPostById(postId: $postId) {
      id
      title
      content
    }
  }
`;
