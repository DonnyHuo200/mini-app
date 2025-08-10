import { gql } from '@apollo/client';
export const QueryLstList = gql`
  query Lsts {
    lsts {
      stakingBTCAmount
      users
      ecosystems
      details {
        protocol
        btcAmount
        tvlUsd
        validator
        apy
        rewards
        yieldDistributor
        url
        category
        apyUpdateTime
        alias
        apyText
        estApy
      }
    }
  }
`;
