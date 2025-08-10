import { gql } from '@apollo/client';
export const Inquire_GRAPQL = gql`
  mutation Inquire($inquireInput: InquireInput) {
    inquire(inquireInput: $inquireInput) {
      roadshowInfo {
        id
        chainId
        roadshowType
        from
        creator
        amount
        currencySymbol
        targetApr
        description
        createdAt
        updatedAt
      }
      amount
      name
      email
      telegram
      additionalInquiry
      createdAt
      updatedAt
    }
  }
`;
