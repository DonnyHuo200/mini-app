import { gql } from '@apollo/client';

export const AddBtcRecords = gql`
  mutation AddBtcRecords($btcRecordsInput: BtcRecordsInput!) {
    addBtcRecords(btcRecordsInput: $btcRecordsInput) {
      id
      depositAmount
      depositHash
      depositFromAddress
      transferToAddress
      chain
      state
      mintHash
      transferHash
      createTime
      createdAt
      updatedAt
    }
  }
`;

export const ADD_EvmBabylonConnection = gql`
  mutation AddEvmBabylonConnection($evmBabylonConnectionInput: EvmBabylonConnectionInput) {
    addEvmBabylonConnection(evmBabylonConnectionInput: $evmBabylonConnectionInput) {
      evmAddress
      babylonAddress
      signMessage
      signature
    }
  }
`;
