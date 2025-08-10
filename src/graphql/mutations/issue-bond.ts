import { gql } from "@apollo/client";
import { PoolInput } from "@/types/API";

export type SubmitIssueParams = {
  issueInput: {
    issuerAddress: string;
    chainId: number;
    contractAddress: string;
    slot: string;
    interestType: string;
    convertibility: boolean;
    creditType: string;
    issueSize: string | number;
    currency: string;
    valueDate: string | number;
    term: number | string;
    maturityDate: string | number;
    couponRate?: string | number;
    expectedRepayment?: string | number;
    isTransferable: boolean;
    imageUrl: string;
    name: string;
    description: string;
    // custodyInput: {
    //   custodyType: string;
    //   custodyAddress: string;
    //   uid: string;
    //   apiKey: string;
    //   apiSecret: string;
    // };
    startSaleTime: string | number;
    endSaleTime: string | number;
    receivingAddress: string;
    maxBuyLimit: string | number;
    minBuyLimit: string | number;
    whitelist: string[];
    fundType: "Closed-end" | "Open-end";
    carriedInterest?: string;
    supervisorId?: number;
  };
};

export const submitIssueMutation = gql`
  mutation BeforeIssue($issueInput: IssueInput) {
    beforeIssue(issueInput: $issueInput) {
      id
    }
  }
`;

export type CheckIssueMutationParams = {
  afterIssueInput: {
    bondId: number;
    txHash: string;
    txStatus: "REJECTED" | "PENDING";
  };
};

export const checkIssueMutation = gql`
  mutation ($afterIssueInput: AfterIssueInput) {
    afterIssue(afterIssueInput: $afterIssueInput) {
      id
    }
  }
`;

export type SubmitOpenFundIssueParams = {
  poolInput: PoolInput;
  // poolInput: {
  //   issuerAddress: string;
  //   chainId: number;
  //   marketContractAddress: string;
  //   openFundShare: string;
  //   fundType: string;
  //   interestType: string;
  //   supervisorId: number;
  //   slot: string;
  //   vault: string;
  //   hardCap: string;
  //   softCap: string;
  //   currency: string;
  //   fundraisingStartTime: number;
  //   valueDate: number;
  //   fundraisingEndTime: number;
  //   subscribeMin: string;
  //   subscribeMax: string;
  //   whitelist: string[];
  //   openFundRedemption: string;
  //   redemptionPeriod: number;
  //   navOracle: string;
  //   navManager: string;
  //   carryRate: string;
  //   name: string;
  //   estimatedAprMin: string;
  //   estimatedAprMax: string;
  //   description: string;
  //   carryCollector: string;
  // };
};

export const submitOpenFundIssueMutation = gql`
  mutation BeforeCreatePool($poolInput: PoolInput) {
    beforeCreatePool(poolInput: $poolInput) {
      id
      poolOrderInfo {
        id
      }
      supervisorInfo {
        id
      }
      currencyInfo {
        symbol
        currencyAddress
        decimals
      }
      fundType
      interestType
      maturityDate
      redemptionPeriod
      isTransferable
      totalAmount
      createdAt
      updatedAt
    }
  }
`;

export type CheckOpenFundIssueMutationParams = {
  afterCreatePoolInput: {
    poolSlotInfoId: number;
    txHash: string;
    txStatus: "REJECTED" | "PENDING";
  };
};

export const checkOpenFundIssueMutation = gql`
  mutation AfterCreatePool($afterCreatePoolInput: AfterCreatePoolInput) {
    afterCreatePool(afterCreatePoolInput: $afterCreatePoolInput) {
      id
    }
  }
`;
