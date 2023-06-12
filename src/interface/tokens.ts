import { erc20Currencies, nativeCurrencies } from "../collections";

export type PaymentMethod = NativeCurrencies | ERC20Currencies;

export type ERC20Currencies = (typeof erc20Currencies)[number];

export type NativeCurrencies = (typeof nativeCurrencies)[number];

export type Tokens = Partial<{ [key in PaymentMethod]: string }>;
