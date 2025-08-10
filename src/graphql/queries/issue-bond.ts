import { gql } from '@apollo/client';

export type IssueConfigParams = {
  issueContractInput: {
    chainId?: number | string;
    fundType: 'Close-end' | 'Open-end';
    issuerAddress: string;
  };
};

export const issueConfigQuery = gql`
  query IssueContract($issueContractInput: IssueContractInput) {
    issueContract(issueContractInput: $issueContractInput) {
      totalCount
      issueContracts {
        contractInfo {
          chainId
          contractAddress
          image
          decimals
          fee
          name
          currencies {
            symbol
            currencyAddress
            decimals
          }
        }
      }
    }
  }
`;

export const supervisorsQuery = gql`
  query Supervisors($filter: SupervisorFilter, $pagination: Pagination, $sort: Sort) {
    supervisors(filter: $filter, pagination: $pagination, sort: $sort) {
      totalCount
      supervisorsInfo {
        id
        name
        label
        address
        chainId
        state
        createdAt
        updatedAt
      }
    }
  }
`;
