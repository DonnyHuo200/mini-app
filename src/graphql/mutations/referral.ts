import { gql } from '@apollo/client';

export const CREATE_REFERRAL = gql`
  mutation CreateReferral($referralInput: ReferralInput) {
    createReferral(referralInput: $referralInput) {
      id
      referralCode
      userAddress
      bindTime
      state
    }
  }
`;
