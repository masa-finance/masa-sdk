export const erc20Currencies = [
  // Masa
  "MASA",
  // wrapped eth
  "WETH",
  // good dollar
  "G$",
  // USDC
  "USDC",
  // celo USD
  "cUSD",
] as const;
export type ERC20Currencies = (typeof erc20Currencies)[number];

export const nativeCurrencies = [
  // ethereum
  "ETH",
  // celo
  "CELO",
  // matic
  "MATIC",
  // binance smart chain
  "BNB",
] as const;
export type NativeCurrencies = (typeof nativeCurrencies)[number];

export type PaymentMethod = NativeCurrencies | ERC20Currencies;

export type Tokens = Partial<{ [key in PaymentMethod]: string }>;
