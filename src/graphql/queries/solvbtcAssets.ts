import { gql } from '@apollo/client';

export const GET_SolvBtcAssets = gql`
  query SolvBtcAssets {
    solvbtcAssets {
      totalAmount
      assets {
        assetName
        assetAmount
        details {
          vault
          vaultAddress
          url
          amount
        }
      }
    }
  }
`;

export const GET_SolvBtcLiabilities = gql`
  query SolvBtcLiabilities {
    solvbtcLiabilities {
      totalAmount
      snapshotTime
      liabilities {
        chainName
        url
        tokenAddress
        totalSupply
        details {
          vault
          vaultAddress
          url
          amount
        }
      }
    }
  }
`;

export const GET_SolvBtcReserves = gql`
  query SolvBtcReserves {
    solvbtcReserves {
      snapshotTime
      totalAmount
      assets {
        assetName
        assetAmount
        order
        details {
          amount
          url
          vault
          vaultAddress
        }
      }
    }
  }
`;

export const GET_SolvBtcIssuances = gql`
  query SolvBtcIssuances {
    solvbtcIssuances {
      snapshotTime
      totalAmount
      liabilities {
        chainName
        tokenAddress
        url
        totalSupply
        order
        details {
          vault
          vaultAddress
          amount
          url
        }
      }
    }
  }
`;

export const GET_SolvBtcBbnReserves = gql`
  query SolvBtcBbnReserves {
    solvbtcBbnReserves {
      snapshotTime
      totalAmount
      reserves {
        vault
        vaultAddress
        url
        amount
      }
    }
  }
`;

export const GET_SolvBtcBbnIssuances = gql`
  query SolvBtcBbnIssuances {
    solvbtcBbnIssuances {
      snapshotTime
      totalAmount
      issuances {
        chainName
        tokenAddress
        url
        totalSupply
        order
      }
    }
  }
`;

export const GET_SolvBtcEnaReserves = gql`
  query SolvBtcEnaReserves {
    solvbtcEnaReserves {
      snapshotTime
      totalAmount
      reserves {
        vault
        vaultAddress
        url
        amount
      }
    }
  }
`;

export const GET_SolvBtcEnaIssuances = gql`
  query SolvBtcEnaIssuances {
    solvbtcEnaIssuances {
      snapshotTime
      totalAmount
      issuances {
        chainName
        tokenAddress
        url
        totalSupply
        order
      }
    }
  }
`;

export const GET_SolvBtcCoreReserves = gql`
  query SolvBtcCoreReserves {
    solvbtcCoreReserves {
      snapshotTime
      totalAmount
      reserves {
        vault
        vaultAddress
        url
        amount
      }
    }
  }
`;

export const GET_SolvBtcCoreIssuances = gql`
  query SolvBtcCoreIssuances {
    solvbtcCoreIssuances {
      snapshotTime
      totalAmount
      issuances {
        chainName
        tokenAddress
        url
        totalSupply
        order
      }
    }
  }
`;

export const GET_SolvBtcJupReserves = gql`
  query SolvBtcJupReserves {
    solvbtcJupReserves {
      snapshotTime
      totalAmount
      reserves {
        vault
        vaultAddress
        url
        amount
        assetName
        btcAmount
      }
    }
  }
`;

export const GET_SolvBtcJupIssuances = gql`
  query SolvBtcJupIssuances {
    solvbtcJupIssuances {
      snapshotTime
      totalAmount
      issuances {
        chainName
        tokenAddress
        url
        totalSupply
        order
      }
    }
  }
`;

export const GET_SolvBtcMReserves = gql`
  query SolvBtcMReserves {
    solvbtcMReserves {
      snapshotTime
      totalAmount
      reserves {
        vault
        vaultAddress
        url
        amount
      }
    }
  }
`;

export const GET_SolvBtcMIssuances = gql`
  query SolvBtcMIssuances {
    solvbtcMIssuances {
      snapshotTime
      totalAmount
      issuances {
        chainName
        tokenAddress
        url
        totalSupply
        order
      }
    }
  }
`;
