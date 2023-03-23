import {
  alfajores,
  basegoerli,
  bsc,
  bsctest,
  celo,
  ethereum,
  goerli,
  mainnet,
  mumbai,
  polygon,
} from "./networks";
import { NetworkName } from "../interface";

const erc20 = ["MASA", "WETH", "G$", "USDC", "cUSD"] as const;
export type ERC20 = (typeof erc20)[number];

const nativeCurrencies = ["ETH", "CELO"] as const;
export type NativeCurrencies = (typeof nativeCurrencies)[number];

export const isNativeCurrency = (
  paymentMethod: unknown
): paymentMethod is NativeCurrencies =>
  nativeCurrencies.includes(paymentMethod as NativeCurrencies);

export const isERC20Currency = (
  paymentMethod: unknown
): paymentMethod is ERC20 => erc20.includes(paymentMethod as ERC20);

export type PaymentMethod = NativeCurrencies | ERC20;

export type Tokens = Partial<{ [key in PaymentMethod]: string }>;

export interface Addresses {
  tokens?: Tokens;
  SoulboundIdentityAddress?: string;
  SoulboundCreditScoreAddress?: string;
  SoulNameAddress?: string;
  SoulStoreAddress?: string;
  SoulLinkerAddress?: string;
  SoulboundGreenAddress?: string;
}

export const addresses: Partial<{ [key in NetworkName]: Addresses }> = {
  // eth
  ethereum,
  goerli,
  // deprecated
  mainnet,
  // bsc
  bsc,
  bsctest,
  // celo
  celo,
  alfajores,
  // polygon
  mumbai,
  polygon,
  // base
  basegoerli,
};
