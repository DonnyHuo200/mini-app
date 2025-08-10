import { gql } from '@apollo/client';

export const UpdateAirdropClaimState = gql`
  mutation UpdateAirdropClaimState($address:String!,$stageNo:Int!,$rewardType:String, $claimTxHash: String!){
    updateAirdropClaimState(address:$address,stageNo:$stageNo,rewardType:$rewardType, claimTxHash: $claimTxHash) 
  }
`;
