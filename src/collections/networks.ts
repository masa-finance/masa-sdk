import { EndpointId } from "@layerzerolabs/lz-definitions";

import type { Addresses, Network, NetworkName } from "../interface";
import { addresses } from "../networks";

// masa
const masa: Network = {
  networkName: "masa",
  chainName: "Masa",
  chainNameShort: "Masa",
  isTestnet: false,
  chainId: 0x3454, // 13396
  rpcUrls: [
    // default https
    "https://subnets.avax.network/masanetwork/mainnet/rpc",
    // alternative https
    undefined,
    // default wss
    undefined,
    // alternative wss
    undefined,
  ],
  nativeCurrency: {
    name: "MASA Token",
    symbol: "MASA",
    decimals: 18,
  },
  blockExplorerUrls: ["https://subnets.avax.network/masa"],
  addresses: addresses["masa"] as Addresses,
  lzEndpointId: EndpointId.MASA_V2_MAINNET,
};
const masatest: Network = {
  networkName: "masatest",
  chainName: "Masa Testnet",
  chainNameShort: "Masa Testnet",
  isTestnet: true,
  chainId: 103454,
  rpcUrls: [
    // default https
    "https://subnets.avax.network/masatestne/testnet/rpc",
    // alternative https
    undefined,
    // default wss
    undefined,
    // alternative wss
    undefined,
  ],
  nativeCurrency: {
    name: "tMASA Token",
    symbol: "tMASA",
    decimals: 18,
  },
  blockExplorerUrls: ["https://subnets-test.avax.network/masatestnet"],
  addresses: addresses["masatest"] as Addresses,
  lzEndpointId: EndpointId.MASA_V2_TESTNET,
};

// bsc
const bsc: Network = {
  networkName: "bsc",
  chainName: "Binance Smart Chain",
  chainNameShort: "BSC",
  isTestnet: false,
  chainId: 56,
  rpcUrls: [
    // default https
    "https://bsc-dataseed1.bnbchain.org",
    // alternative https
    "https://bsc.meowrpc.com",
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
  lzEndpointId: EndpointId.BSC_V2_MAINNET,
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
  lzEndpointId: EndpointId.BSC_V2_TESTNET,
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
    "https://opbnb.publicnode.com",
    // default wss
    "wss://opbnb.publicnode.com",
    // alternative wss
    "wss://opbnb-mainnet.nodereal.io/ws/v1/e9a36765eb8a40b9bd12e680a1fd2bc5",
  ],
  nativeCurrency: {
    name: "BNB",
    symbol: "BNB",
    decimals: 18,
  },
  blockExplorerUrls: ["https://opbnbscan.com"],
  addresses: addresses["opbnb"] as Addresses,
  lzEndpointId: EndpointId.OPBNB_V2_MAINNET,
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
    "https://opbnb-testnet.nodereal.io/v1/e9a36765eb8a40b9bd12e680a1fd2bc5",
    // default wss
    "wss://opbnb-testnet.nodereal.io/ws/v1/e9a36765eb8a40b9bd12e680a1fd2bc5",
    // alternative wss
    "wss://opbnb-testnet.nodereal.io/ws/v1/64a9df0874fb4a93b9d0a3849de012d3",
  ],
  nativeCurrency: {
    name: "tBNB",
    symbol: "tBNB",
    decimals: 18,
  },
  blockExplorerUrls: ["https://testnet.opbnbscan.com"],
  addresses: addresses["opbnbtest"] as Addresses,
  lzEndpointId: EndpointId.OPBNB_V2_TESTNET,
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
  lzEndpointId: EndpointId.CELO_V2_MAINNET,
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
  lzEndpointId: EndpointId.CELO_V2_TESTNET,
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
  lzEndpointId: EndpointId.POLYGON_V2_MAINNET,
};
const amoy: Network = {
  networkName: "amoy",
  chainName: "Amoy Testnet",
  chainNameShort: "Amoy",
  isTestnet: true,
  chainId: 80002,
  nativeCurrency: {
    name: "tMATIC",
    symbol: "tMATIC", // 2-6 characters long
    decimals: 18,
  },
  rpcUrls: [
    // default https
    "https://rpc-amoy.polygon.technology",
    // alternative https
    undefined,
    // default wss
    "wss://polygon-amoy-bor-rpc.publicnode.com",
    // alternative wss
    undefined,
  ],
  blockExplorerUrls: ["https://amoy.polygonscan.com/"],
  blockExplorerApiUrls: ["https://api-amoy.polygonscan.com/api"],
  addresses: addresses["amoy"] as Addresses,
  lzEndpointId: EndpointId.AMOY_V2_TESTNET,
};
// @deprecated: use amoy instead
const mumbai: Network = {
  networkName: "mumbai",
  chainName: "Mumbai Testnet",
  chainNameShort: "Mumbai",
  isTestnet: true,
  isDeprecated: true,
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
  lzEndpointId: EndpointId.POLYGON_V2_TESTNET,
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
    "https://eth.drpc.org",
    // default wss
    "wss://ethereum.publicnode.com",
    // alternative wss
    undefined,
  ],
  blockExplorerUrls: ["https://etherscan.io"],
  blockExplorerApiUrls: ["https://api.etherscan.io/api"],
  addresses: addresses["ethereum"] as Addresses,
  lzEndpointId: EndpointId.ETHEREUM_V2_MAINNET,
};
// @deprecated: use sepolia instead
const goerli: Network = {
  networkName: "goerli",
  chainName: "Goerli Testnet",
  chainNameShort: "Goerli",
  isTestnet: true,
  isDeprecated: true,
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
const sepolia: Network = {
  networkName: "sepolia",
  chainName: "Sepolia Testnet",
  chainNameShort: "Sepolia",
  isTestnet: true,
  chainId: 11155111,
  nativeCurrency: {
    name: "ETH",
    symbol: "ETH", // 2-6 characters long
    decimals: 18,
  },
  rpcUrls: [
    // default https
    "https://rpc.sepolia.org",
    // alternative https
    "https://rpc2.sepolia.org",
    // default wss
    "wss://sepolia.drpc.org",
    // alternative wss
    undefined,
  ],
  blockExplorerUrls: ["https://sepolia.etherscan.io"],
  blockExplorerApiUrls: ["https://api-sepolia.etherscan.io/api"],
  addresses: addresses["sepolia"] as Addresses,
  lzEndpointId: EndpointId.SEPOLIA_V2_TESTNET,
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
  lzEndpointId: EndpointId.BASE_V2_MAINNET,
};
// @deprecated: use base sepolia instead
const basegoerli: Network = {
  networkName: "basegoerli",
  chainName: "Base Goerli Testnet",
  chainNameShort: "Base Goerli",
  isTestnet: true,
  isDeprecated: true,
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
const basesepolia: Network = {
  networkName: "basesepolia",
  chainName: "Base Sepolia Testnet",
  chainNameShort: "Base Sepolia",
  isTestnet: true,
  chainId: 84532,
  nativeCurrency: {
    name: "ETH",
    symbol: "ETH", // 2-6 characters long
    decimals: 18,
  },
  rpcUrls: [
    // default https
    "https://sepolia.base.org",
  ],
  blockExplorerUrls: ["https://base-sepolia.blockscout.com"],
  blockExplorerApiUrls: ["https://api-sepolia.basescan.org/api"],
  addresses: addresses["basesepolia"] as Addresses,
  lzEndpointId: EndpointId.BASESEP_V2_TESTNET,
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
  lzEndpointId: EndpointId.SCROLL_V2_MAINNET,
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
  lzEndpointId: EndpointId.SCROLL_V2_MAINNET,
};

// aurora
const auroratest: Network = {
  networkName: "auroratest",
  chainName: "Aurora Testnet",
  chainNameShort: "Aurora Test",
  isTestnet: true,
  chainId: 1313161555,
  nativeCurrency: {
    name: "ETH",
    symbol: "ETH", // 2-6 characters long
    decimals: 18,
  },
  rpcUrls: [
    // default https
    "https://testnet.aurora.dev",
    // alternative https
    undefined,
    // default wss
    undefined,
    // alternative wss
    undefined,
  ],
  blockExplorerUrls: ["https://explorer.testnet.aurora.dev"],
  addresses: addresses["auroratest"] as Addresses,
  lzEndpointId: EndpointId.AURORA_V2_TESTNET,
};

export const SupportedNetworks: Partial<{
  [key in NetworkName]: Network;
}> = {
  // masa
  masa,
  masatest,
  // ETH
  ethereum,
  // @deprecated: use sepolia instead
  goerli,
  sepolia,
  // BSC
  bsc,
  bsctest,
  // op bnb
  opbnb,
  opbnbtest,
  // Polygon
  polygon,
  amoy,
  // @deprecated: use base amoy instead
  mumbai,
  // celo
  celo,
  alfajores,
  // base
  base,
  // @deprecated: use base sepolia instead
  basegoerli,
  basesepolia,
  // scroll
  scroll,
  scrollsepolia,
  // aurora
  auroratest,
};
