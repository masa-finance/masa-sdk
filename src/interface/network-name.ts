export type NetworkName =
  // eth
  | "goerli" // testnet
  | "ethereum" // mainnet
  // celo
  | "alfajores" // testnet
  | "celo" // mainnet
  // polygon
  | "mumbai" // testnet
  | "polygon" // mainnet
  // BSC
  | "bsctest" // testnet
  | "bsc" // mainnet
  // base
  | "basegoerli" // testnet
  | "base" // mainnet
  // fallback for unknown networks
  | "unknown";
