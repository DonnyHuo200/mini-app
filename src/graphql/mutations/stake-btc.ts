import { gql } from '@apollo/client';

export const AddStakeBtcRecord = gql`
  mutation AddStakeBtcRecord($btcStakeRecordsInput: BtcStakeRecordsInput!) {
    addStakeBtcRecord(btcStakeRecordsInput: $btcStakeRecordsInput) {
      id
      chainId
      poolId
      recordType
      depositAmount
      depositTxHash
      depositFromAddress
      depositToAddress
      transferToAddress
      createdAt
    }
  }
`;

export const BtcMintRegister = gql`
  mutation BtcMintRegister($btcMintRegisterInput: BtcMintRegisterInput) {
    btcMintRegister(btcMintRegisterInput: $btcMintRegisterInput) {
      id
      btcAddress
      chainId
      tokenAddress
      evmAddress
      opReturnHash
      createdAt
      updatedAt
    }
  }
`;

export const UpdateClaimTxHash = gql`
  mutation UpdateClaimTxHash($id: Int!, $claimTxHash: String!) {
    updateClaimTxHash(id: $id, claimTxHash: $claimTxHash)
  }
`;
