import { NetworkName } from "../interface";
import { addresses, Addresses } from "../contracts";

export interface Network {
  /**
   * the technical network name that the SDK knows
   */
  networkName: NetworkName;
  /**
   * The long chain name that metamask displays or that we use to
   * offer the user to switch networks
   */
  chainName: string;
  /**
   * A short version of the Chain Name to be displayed in Buttons or
   * locations with less space
   */
  chainNameShort: string;
  /**
   * The networks chain id used to add the network to the wallet
   */
  chainId: number;
  /**
   * The list of available rpc urls, required for adding the network
   * to the wallet
   */
  rpcUrls: string[];
  /**
   * Information about the native currency
   */
  nativeCurrency?: {
    name: string;
    symbol: string;
    decimals: number;
  };
  /**
   * set of block explorer urls
   */
  blockExplorerUrls?: string[];
  /**
   * Masa Curated known Addresses of Contracts like Business logic and tokens
   */
  addresses: Addresses;
  /**
   * the default gas slippage percentage used on some testnets
   */
  gasSlippagePercentage?: number;
}

export const getNetworkNameByChainId = (chainId: number): NetworkName => {
  const network: Network | undefined = Object.values(SupportedNetworks).find(
    (network: Network) => network.chainId === chainId
  );

  if (!network) {
    console.warn("Network detection failed!", chainId);
    return "unknown";
  }

  return network.networkName;
};

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
  rpcUrls: ["https://polygon-rpc.com/"],
  blockExplorerUrls: ["https://polygonscan.com/"],
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
  blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
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
  addresses: addresses["goerli"] as Addresses,
};

// base
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
  addresses: addresses["basegoerli"] as Addresses,
};

export const SupportedNetworks: Partial<{
  [key in NetworkName]: Network;
}> = {
  // ETH
  ethereum,
  goerli,
  mainnet: ethereum,
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
  basegoerli,
};
