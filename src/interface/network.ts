import type { Addresses } from "./addresses";
import type { NetworkName } from "./network-name";

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
   * is this network a test network or not?
   */
  isTestnet: boolean;
  /**
   * The list of available rpc urls, required for adding the network
   * to the wallet
   */
  rpcUrls: (string | undefined)[];
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
   * set of block explorer api urls
   */
  blockExplorerApiUrls?: string[];
  /**
   * Masa Curated known Addresses of Contracts like Business logic and tokens
   */
  addresses: Addresses;
  /**
   * the default gas slippage percentage used on some testnets
   */
  gasSlippagePercentage?: number;
  /**
   * skip eip1559 gas price calculation for this network
   */
  skipEip1559?: boolean;
}
