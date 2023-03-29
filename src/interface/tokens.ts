export const erc20Currencies = ["MASA", "WETH", "G$", "USDC", "cUSD"] as const;
export type ERC20Currencies = (typeof erc20Currencies)[number];

export const nativeCurrencies = ["ETH", "CELO"] as const;
export type NativeCurrencies = (typeof nativeCurrencies)[number];

export const isNativeCurrency = (
  paymentMethod: unknown
): paymentMethod is NativeCurrencies =>
  nativeCurrencies.includes(paymentMethod as NativeCurrencies);

export const isERC20Currency = (
  paymentMethod: unknown
): paymentMethod is ERC20Currencies =>
  erc20Currencies.includes(paymentMethod as ERC20Currencies);

export type PaymentMethod = NativeCurrencies | ERC20Currencies;

export type Tokens = Partial<{ [key in PaymentMethod]: string }>;
