import { gql } from '@apollo/client';

export interface IssuerDetails {
  id: number;
  accountInfo: {
    id: number;
    address: string;
    username: string;
    ensName: string;
    avatar: string;
    isIssuer: boolean;
    bio: string;
    email: string;
    twitter: string;
    createdAt: string;
    updatedAt: string;
  };
  category?: string;
  description: string;
  institutionUrl: string;
  isKyb: string;
  kybInfo?: any;
  creator: string;
  extraInfo?: any;
  createdAt: string;
}

export const issuerInfoQuery = (account: string) => gql`
  query IssuerInfo {
    issuerInfo(address: "${account}") {
      id
      accountInfo {
        id
        address
        username
        ensName
        avatar
        isIssuer
        bio
        createdAt
        updatedAt
      }
      category
      description
      isKyb
      kybInfo
      creator
      state
      extraInfo
      createdAt
    }
  }
`;

interface UserInfoParams {
  address: string;
  bio?: string;
  email: string;
  twitter: string;
  institutionUrl: string;
  avatar: string;
}

export interface EditIssuerInfoParams {
  issuerInput: UserInfoParams | { description: string };
}

export const editIssuerInfo = gql`
  mutation IssuerUpdate($issuerInput: IssuerInput) {
    issuerUpdate(issuerInput: $issuerInput) {
      id
      accountInfo {
        id
        address
        username
        ensName
        avatar
        isIssuer
        bio
        createdAt
        updatedAt
      }
      isKyb
      kybInfo
      creator
      extraInfo
      createdAt
      updatedAt
    }
  }
`;

export interface EditUserInfoParams {
  userInput: UserInfoParams | { username: string };
}

export const editUserInfo = gql`
  mutation UserUpdate($userInput: UserInput) {
    userUpdate(userInput: $userInput) {
      id
      address
      username
      ensName
      avatar
      isIssuer
      bio
      createdAt
      updatedAt
    }
  }
`;

export const manageSalesQuery = gql`
  query Issuances($filter: IssuanceFilter, $pagination: Pagination, $sort: Sort) {
    issuances(filter: $filter, pagination: $pagination, sort: $sort) {
      totalCount
      bondsInfo {
        id
        productInfo {
          name
          slot
          chainId
          createTxHash
          txStatus
          contractInfo {
            decimals
            contractAddress
            name
            symbol
            chainId
          }
          tags {
            tag
          }
        }
        issuerInfo {
          accountInfo {
            address
            avatar
            username
          }
        }
        issuances {
          startSaleTime
          endSaleTime
          auditStatus
          isWhitelisted
        }
        interestType
        convertibility
        creditType
        currencyInfo {
          currencyAddress
          decimals
          symbol
        }
        term
        couponRate
        valueDate
        maturityDate
        issueSize
        totalValue
        isTransferable
        expectedToPay
        repaidValue
        repayInfos {
          address
        }
        payoffDate
        extraInfo
        fundType
        showNav
        supervisorInfo {
          name
          label
          address
          chainId
          state
        }
        carriedInterest
        isInterestRateSet
        createdAt
        updatedAt
      }
    }
  }
`;

export const issuerStatsQuery = gql`
  query IssuerStats($issuerId: Int) {
    issuerStats(issuerId: $issuerId) {
      totalIssued
      totalRepaid
      totalInterest
    }
  }
`;

export const updateProfileImageUrl = gql`
  mutation UpdateProfileImageUrl($imageInput: ImageInput) {
    updateProfileImageUrl(imageInput: $imageInput)
  }
`;

export const GET_NavHistory_GRAPHQL = gql`
  query NavHistory($filter: NavHistoryFilter, $pagination: Pagination, $sort: Sort) {
    navHistory(filter: $filter, pagination: $pagination, sort: $sort) {
      poolSlotInfoId
      symbol
      allTimeHigh
      currencyDecimals
      totalCount
      serialData {
        nav
        navDate
      }
    }
  }
`;

export const getNAVRecords = gql`
  query NavRecords($filter: NavRecordsFilter, $pagination: Pagination, $sort: Sort) {
    navRecords(filter: $filter, pagination: $pagination, sort: $sort) {
      totalCount
      symbol
      currencyDecimals
      serialData {
        nav
        time
        navType
      }
    }
  }
`;
