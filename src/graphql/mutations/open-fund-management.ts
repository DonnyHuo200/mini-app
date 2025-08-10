import { gql } from '@apollo/client';

// 复权净值
export const originalNavAdd = gql`
  mutation OriginalNavAdd($originalNavInput: OriginalNavInput) {
    originalNavAdd(originalNavInput: $originalNavInput) {
      id
    }
  }
`;

// 复权净值
export const originalNavUpdateHash = gql`
  mutation OriginalNavUpdateHash($originalNavUpdateInput: OriginalNavUpdateInput) {
    originalNavUpdateHash(originalNavUpdateInput: $originalNavUpdateInput) {
      id
      originalNav
      nav
      txHash
    }
  }
`;
