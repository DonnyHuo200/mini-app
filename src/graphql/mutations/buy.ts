import { gql } from '@apollo/client';
export const SaveWalletInfo = gql`
  mutation SaveWalletInfo($walletInfoInput: WalletInfoInput) {
    saveWalletInfo(walletInfoInput: $walletInfoInput) {
      chainId
      userAddress
      txHash
      walletType
      recordDate
    }
  }
`;
