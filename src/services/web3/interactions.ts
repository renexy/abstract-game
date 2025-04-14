/* eslint-disable @typescript-eslint/no-explicit-any */
const abi = [
  {
    inputs: [
      { internalType: "address", name: "_nootTokenAddress", type: "address" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "balances",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
    name: "deposit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "nootToken",
    outputs: [{ internalType: "contract IERC20", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "address", name: "to", type: "address" },
    ],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  { stateMutability: "payable", type: "receive" },
];

const ERC20_ABI = [
  {
    "constant": false,
    "inputs": [
      { "name": "spender", "type": "address" },
      { "name": "amount", "type": "uint256" }
    ],
    "name": "approve",
    "outputs": [
      { "name": "", "type": "bool" }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  }
];


const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;

export default async function WriteContract(agwClient: any) {
  
  const transactionHash = await agwClient.writeContract({
    abi: abi,
    address: contractAddress,
    functionName: "deposit",
    args: [1000000000000000000],
  });

  console.log(transactionHash)
}


export async function approveTokens(agwClient: any, address: any) {
  try {
    // Set the token contract and the approval parameters
    const tokenAddress = '0xe3d94b74131f3d831b407fcef76e7b8ee78f8096'; // ERC-20 token address
    const vaultAddress = '0xA639587142E1056FB0e527dE855542a5F465695b'; // Vault contract address
    const amount = '100000000000000000000'; // Amount to approve in wei (example: 100 tokens with 18 decimals)

    // Use writeContract to send the approval transaction
    const txHash = await agwClient.writeContract({
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: 'approve',
      args: [vaultAddress, amount],
      from: address
    });

    console.log('Approval transaction sent:', txHash);
  } catch (error) {
    console.error('Approval failed:', error);
  }
}