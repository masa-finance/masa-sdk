import type { Addresses, Network, NetworkName } from "../interface";
import { addresses } from "../networks";

// bsc
const bsc: Network = {
  networkName: "bsc",
  chainName: "Binance Smart Chain",
  chainNameShort: "BSC",
  isTestnet: false,
  chainId: 56,
  rpcUrls: [
    // default https
    "https://binance.llamarpc.com",
    // alternative https
    undefined,
    // default wss
    "wss://bsc.publicnode.com",
    // alternative wss
    undefined,
  ],
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
  isTestnet: true,
  chainId: 97,
  rpcUrls: [
    // default https
    "https://data-seed-prebsc-1-s1.binance.org:8545",
    // alternative https
    undefined,
    // default wss
    "wss://bsc-testnet.publicnode.com",
    // alternative wss
    undefined,
  ],
  nativeCurrency: {
    name: "tBNB",
    symbol: "tBNB",
    decimals: 18,
  },
  blockExplorerUrls: ["https://testnet.bscscan.com"],
  blockExplorerApiUrls: ["https://api-testnet.bscscan.com/api"],
  addresses: addresses["bsctest"] as Addresses,
};

// op bnb
const opbnb: Network = {
  networkName: "opbnb",
  chainName: "opBNB Mainnet",
  chainNameShort: "opBNB",
  isTestnet: false,
  chainId: 204,
  rpcUrls: [
    // default https
    "https://opbnb-mainnet-rpc.bnbchain.org",
    // alternative https
    undefined,
    // default wss
    "wss://opbnb.publicnode.com",
    // alternative wss
    undefined,
  ],
  nativeCurrency: {
    name: "BNB",
    symbol: "BNB",
    decimals: 18,
  },
  blockExplorerUrls: ["https://opbnbscan.com"],
  addresses: addresses["opbnb"] as Addresses,
};
const opbnbtest: Network = {
  networkName: "opbnbtest",
  chainName: "opBNB Testnet",
  chainNameShort: "opBNB Test",
  isTestnet: true,
  chainId: 5611,
  rpcUrls: [
    // default https
    "https://opbnb-testnet-rpc.bnbchain.org",
    // alternative https
    undefined,
    // default wss
    undefined,
    // alternative wss
    undefined,
  ],
  nativeCurrency: {
    name: "tBNB",
    symbol: "tBNB",
    decimals: 18,
  },
  blockExplorerUrls: ["https://testnet.opbnbscan.com"],
  addresses: addresses["opbnbtest"] as Addresses,
};

// celo
const celo: Network = {
  networkName: "celo",
  chainName: "Celo Mainnet",
  chainNameShort: "Celo",
  isTestnet: false,
  chainId: 42220,
  rpcUrls: [
    // default https
    "https://forno.celo.org",
    // alternative https
    undefined,
    // default wss
    "wss://forno.celo.org/ws",
    // alternative wss
    undefined,
  ],
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
  isTestnet: true,
  chainId: 44787,
  rpcUrls: [
    // default https
    "https://alfajores-forno.celo-testnet.org",
    // alternative https
    undefined,
    // default wss
    "wss://alfajores-forno.celo-testnet.org/ws",
    // alternative wss
    undefined,
  ],
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
  isTestnet: false,
  chainId: 137,
  nativeCurrency: {
    name: "MATIC",
    symbol: "MATIC", // 2-6 characters long
    decimals: 18,
  },
  rpcUrls: [
    // default https
    "https://polygon-rpc.com",
    // alternative https
    undefined,
    // default wss
    "wss://polygon-bor.publicnode.com",
    // alternative wss
    undefined,
  ],
  blockExplorerUrls: ["https://polygonscan.com"],
  blockExplorerApiUrls: ["https://api.polygonscan.com/api"],
  addresses: addresses["polygon"] as Addresses,
  // https://github.com/maticnetwork/bor/issues/384
  skipEip1559: true,
};
const mumbai: Network = {
  networkName: "mumbai",
  chainName: "Mumbai Testnet",
  chainNameShort: "Mumbai",
  isTestnet: true,
  chainId: 80001,
  nativeCurrency: {
    name: "tMATIC",
    symbol: "tMATIC", // 2-6 characters long
    decimals: 18,
  },
  rpcUrls: [
    // default https
    "https://polygon-testnet.public.blastapi.io",
    // alternative https
    undefined,
    // default wss
    undefined,
    // alternative wss
    undefined,
  ],
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
  isTestnet: false,
  chainId: 1,
  nativeCurrency: {
    name: "ETH",
    symbol: "ETH", // 2-6 characters long
    decimals: 18,
  },
  rpcUrls: [
    // default https
    "https://rpc.ankr.com/eth",
    // alternative https
    undefined,
    // default wss
    "wss://ethereum.publicnode.com",
    // alternative wss
    undefined,
  ],
  blockExplorerUrls: ["https://etherscan.io"],
  blockExplorerApiUrls: ["https://api.etherscan.io/api"],
  addresses: addresses["ethereum"] as Addresses,
};
const goerli: Network = {
  networkName: "goerli",
  chainName: "Goerli Testnet",
  chainNameShort: "Goerli",
  isTestnet: true,
  chainId: 5,
  nativeCurrency: {
    name: "ETH",
    symbol: "ETH", // 2-6 characters long
    decimals: 18,
  },
  rpcUrls: [
    // default https
    "https://rpc.ankr.com/eth_goerli",
    // alternative https
    undefined,
    // default wss
    "wss://ethereum-goerli.publicnode.com",
    // alternative wss
    undefined,
  ],
  blockExplorerUrls: ["https://goerli.etherscan.io"],
  blockExplorerApiUrls: ["https://api-goerli.etherscan.io/api"],
  addresses: addresses["goerli"] as Addresses,
};

// base mainnet
const base: Network = {
  networkName: "base",
  chainName: "Base Mainnet",
  chainNameShort: "Base",
  isTestnet: false,
  chainId: 8453,
  nativeCurrency: {
    name: "ETH",
    symbol: "ETH", // 2-6 characters long
    decimals: 18,
  },
  rpcUrls: [
    // default https
    "https://mainnet.base.org",
    // alternative https
    undefined,
    // default wss
    "wss://base.publicnode.com",
    // alternative wss
    undefined,
  ],
  blockExplorerUrls: ["https://basescan.org"],
  blockExplorerApiUrls: ["https://api.basescan.org/api"],
  addresses: addresses["base"] as Addresses,
};
const basegoerli: Network = {
  networkName: "basegoerli",
  chainName: "Base Goerli Testnet",
  chainNameShort: "Base Goerli",
  isTestnet: true,
  chainId: 84531,
  nativeCurrency: {
    name: "ETH",
    symbol: "ETH", // 2-6 characters long
    decimals: 18,
  },
  rpcUrls: [
    // default https
    "https://goerli.base.org",
    // alternative https
    undefined,
    // default wss
    "wss://base-goerli.publicnode.com",
    // alternative wss
    undefined,
  ],
  blockExplorerUrls: ["https://goerli.basescan.org"],
  blockExplorerApiUrls: ["https://api-goerli.basescan.org/api"],
  addresses: addresses["basegoerli"] as Addresses,
};

// scroll mainnet
const scroll: Network = {
  networkName: "scroll",
  chainName: "Scroll Mainnet",
  chainNameShort: "Scroll",
  isTestnet: false,
  chainId: 534352,
  nativeCurrency: {
    name: "ETH",
    symbol: "ETH", // 2-6 characters long
    decimals: 18,
  },
  rpcUrls: [
    // default https
    "https://rpc.scroll.io",
    // alternative https
    undefined,
    // default wss
    undefined,
    // alternative wss
    undefined,
  ],
  blockExplorerUrls: ["https://scrollscan.com"],
  addresses: addresses["scroll"] as Addresses,
};
const scrollsepolia: Network = {
  networkName: "scrollsepolia",
  chainName: "Scroll Sepolia Testnet",
  chainNameShort: "Scroll Sepolia",
  isTestnet: true,
  chainId: 534351,
  nativeCurrency: {
    name: "ETH",
    symbol: "ETH", // 2-6 characters long
    decimals: 18,
  },
  rpcUrls: [
    // default https
    "https://sepolia-rpc.scroll.io",
    // alternative https
    undefined,
    // default wss
    undefined,
    // alternative wss
    undefined,
  ],
  blockExplorerUrls: ["https://sepolia.scrollscan.com"],
  addresses: addresses["scrollsepolia"] as Addresses,
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
  // op bnb
  opbnb,
  opbnbtest,
  // Polygon
  polygon,
  mumbai,
  // celo
  celo,
  alfajores,
  // base
  base,
  basegoerli,
  // scroll
  scroll,
  scrollsepolia,
};
