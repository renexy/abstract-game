import { AbstractClient } from "@abstract-foundation/agw-client";
import { createPublicClient, http } from "viem";
import { abstractTestnet } from "viem/chains";

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
    constant: false,
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
];

const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
const tokenAddress = import.meta.env.VITE_TOKEN_ADDRESS;

export async function depositTokenstest(agwClient: AbstractClient) {
  try {
    const transactionHash = await agwClient.writeContract({
      abi: abi,
      address: contractAddress,
      functionName: "deposit",
      args: [1000000000000000000],
    });

    const publicClient = createPublicClient({
      chain: abstractTestnet,
      transport: http(),
    });

    await publicClient.waitForTransactionReceipt({
      hash: transactionHash,
    });

    return 1;
  } catch (error) {
    console.error(error);
    return -1;
  }
}

export async function depositTokens(agwClient: AbstractClient) {
  try {
    const amount = "1000000000000000000";

    const txHash = await agwClient.writeContract({
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: "approve",
      args: [contractAddress, amount],
    });

    const publicClient = createPublicClient({
      chain: abstractTestnet,
      transport: http(),
    });

    const re = await publicClient.waitForTransactionReceipt({
      hash: txHash,
    });

    console.log(re, "lol");

    return 1;
  } catch (error) {
    console.error(error);
    return -1;
  }
}
