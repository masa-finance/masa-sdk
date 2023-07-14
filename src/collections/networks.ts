import type { Addresses, Network, NetworkName } from "../interface";
import { addresses } from "../networks";

// bsc
const bsc: Network = {
  networkName: "bsc",
  chainName: "Binance Smart Chain",
  chainNameShort: "BSC",
  chainId: 56,
  rpcUrls: ["https://endpoints.omniatech.io/v1/bsc/mainnet/public"],
  nativeCurrency: {
    name: "BNB",
    symbol: "BNB",
    decimals: 18,
  },
  blockExplorerUrls: ["https://bscscan.com"],
  blockExplorerApiUrls: ["https://api.bscscan.com/api"],
  addresses: addresses["bsc"] as Addresses,
};
const bsctest: Network = {
  networkName: "bsctest",
  chainName: "Binance Smart Chain Testnet",
  chainNameShort: "BSC Testnet",
  chainId: 97,
  rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545"],
  nativeCurrency: {
    name: "tBNB",
    symbol: "tBNB",
    decimals: 18,
  },
  blockExplorerUrls: ["https://testnet.bscscan.com"],
  blockExplorerApiUrls: ["https://api-testnet.bscscan.com/api"],
  addresses: addresses["bsctest"] as Addresses,
};

// celo
const celo: Network = {
  networkName: "celo",
  chainName: "Celo Mainnet",
  chainNameShort: "Celo",
  chainId: 42220,
  rpcUrls: ["https://forno.celo.org"],
  nativeCurrency: {
    name: "CELO",
    symbol: "CELO",
    decimals: 18,
  },
  blockExplorerUrls: ["https://celoscan.io"],
  blockExplorerApiUrls: ["https://api.celoscan.io/api"],
  addresses: addresses["celo"] as Addresses,
};
const alfajores: Network = {
  networkName: "alfajores",
  chainName: "Alfajores Network",
  chainNameShort: "Alfajores",
  chainId: 44787,
  rpcUrls: ["https://alfajores-forno.celo-testnet.org"],
  nativeCurrency: {
    name: "CELO",
    symbol: "CELO",
    decimals: 18,
  },
  blockExplorerUrls: ["https://alfajores.celoscan.io"],
  blockExplorerApiUrls: ["https://api-alfajores.celoscan.io/api"],
  addresses: addresses["alfajores"] as Addresses,
};

// polygon
const polygon: Network = {
  networkName: "polygon",
  chainName: "Polygon Mainnet",
  chainNameShort: "Polygon",
  chainId: 137,
  nativeCurrency: {
    name: "MATIC",
    symbol: "MATIC", // 2-6 characters long
    decimals: 18,
  },
  rpcUrls: ["https://polygon-rpc.com"],
  blockExplorerUrls: ["https://polygonscan.com"],
  blockExplorerApiUrls: ["https://api.polygonscan.com/api"],
  addresses: addresses["polygon"] as Addresses,
};
const mumbai: Network = {
  networkName: "mumbai",
  chainName: "Mumbai Testnet",
  chainNameShort: "Mumbai",
  chainId: 80001,
  nativeCurrency: {
    name: "tMATIC",
    symbol: "tMATIC", // 2-6 characters long
    decimals: 18,
  },
  rpcUrls: ["https://polygon-testnet.public.blastapi.io"],
  blockExplorerUrls: ["https://mumbai.polygonscan.com"],
  blockExplorerApiUrls: ["https://api-mumbai.polygonscan.com/api"],
  addresses: addresses["mumbai"] as Addresses,
  gasSlippagePercentage: 5000,
};

// ethereum
const ethereum: Network = {
  networkName: "ethereum",
  chainName: "Ethereum Mainnet",
  chainNameShort: "Ethereum",
  chainId: 1,
  nativeCurrency: {
    name: "ETH",
    symbol: "ETH", // 2-6 characters long
    decimals: 18,
  },
  rpcUrls: ["https://rpc.ankr.com/eth"],
  blockExplorerUrls: ["https://etherscan.io"],
  blockExplorerApiUrls: ["https://api.etherscan.io/api"],
  addresses: addresses["ethereum"] as Addresses,
};
const goerli: Network = {
  networkName: "goerli",
  chainName: "Goerli Testnet",
  chainNameShort: "Goerli",
  chainId: 5,
  nativeCurrency: {
    name: "ETH",
    symbol: "ETH", // 2-6 characters long
    decimals: 18,
  },
  rpcUrls: ["https://rpc.ankr.com/eth_goerli"],
  blockExplorerUrls: ["https://goerli.etherscan.io"],
  blockExplorerApiUrls: ["https://api-goerli.etherscan.io/api"],
  addresses: addresses["goerli"] as Addresses,
};

// base
const base: Network = {
  networkName: "base",
  chainName: "Base Mainnet",
  chainNameShort: "Base",
  chainId: 8453,
  nativeCurrency: {
    name: "ETH",
    symbol: "ETH", // 2-6 characters long
    decimals: 18,
  },
  rpcUrls: [
    // temp rpc url
    "https://developer-access-mainnet.base.org",
    "https://mainnet.base.org",
  ],
  blockExplorerUrls: ["https://basescan.org"],
  blockExplorerApiUrls: ["https://api-goerli.basescan.org/api"],
  addresses: addresses["base"] as Addresses,
};
const basegoerli: Network = {
  networkName: "basegoerli",
  chainName: "Base Goerli Testnet",
  chainNameShort: "Base Goerli",
  chainId: 84531,
  nativeCurrency: {
    name: "ETH",
    symbol: "ETH", // 2-6 characters long
    decimals: 18,
  },
  rpcUrls: ["https://goerli.base.org"],
  blockExplorerUrls: ["https://goerli.basescan.org"],
  blockExplorerApiUrls: ["https://api-goerli.basescan.org/api"],
  addresses: addresses["basegoerli"] as Addresses,
};

export const SupportedNetworks: Partial<{
  [key in NetworkName]: Network;
}> = {
  // ETH
  ethereum,
  goerli,
  // BSC
  bsc,
  bsctest,
  // Polygon
  polygon,
  mumbai,
  // celo
  celo,
  alfajores,
  // base
  base,
  basegoerli,
};
