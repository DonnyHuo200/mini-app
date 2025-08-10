const revokeABI = [
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "poolId_",
        type: "bytes32"
      },
      {
        internalType: "uint256",
        name: "openFundRedemptionId_",
        type: "uint256"
      }
    ],
    name: "revokeRedeem",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  }
];

const V2ABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "targetToken_",
        type: "address"
      },
      {
        internalType: "address",
        name: "redemption_",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "redemptionId_",
        type: "uint256"
      }
    ],
    name: "cancelWithdrawRequest",
    outputs: [
      {
        internalType: "uint256",
        name: "targetTokenAmount_",
        type: "uint256"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  }
];

const V1ABI = [
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "poolId_",
        type: "bytes32"
      },
      {
        internalType: "uint256",
        name: "openFundRedemptionId_",
        type: "uint256"
      }
    ],
    name: "cancelRedemption",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  }
];

export { revokeABI, V2ABI, V1ABI };
