import { gql } from '@apollo/client';

export const UserBtcStakeRecords = gql`
  query UserBtcStakeRecords($btcRecordsFilter: UserBtcRecordsFilter!, $pagination: Pagination, $sort: Sort) {
    userBtcStakeRecords(btcRecordsFilter: $btcRecordsFilter, pagination: $pagination, sort: $sort) {
      totalCount
      btcStakeMintRecord {
        id
        chainId
        tokenAddress
        depositAmount
        depositTxHash
        state
        signature
        btcMinterContractAddress
        opReturnHash
        signer
        claimTxHash
        createdAt
      }
    }
  }
`;

export const ManagementBtcStakeRecords = gql`
  query ManagementBtcStakeRecords($btcRecordsFilter: BtcRecordsFilter!, $pagination: Pagination, $sort: Sort) {
    managementBtcStakeRecords(btcRecordsFilter: $btcRecordsFilter, pagination: $pagination, sort: $sort) {
      totalCount
      btcStakeMintRecord {
        id
        chainId
        recordType
        depositAmount
        depositTxHash
        depositFromAddress
        depositToAddress
        transferToAddress
        claimTxHash
        state
        createdAt
      }
    }
  }
`;

export const GetVaultRetailAddress = gql`
  query GetVaultRetailAddress {
    getVaultRetailAddress
  }
`;
