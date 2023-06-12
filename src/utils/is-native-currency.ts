import { NativeCurrencies, nativeCurrencies } from "../interface";

export const isNativeCurrency = (
  paymentMethod: unknown
): paymentMethod is NativeCurrencies =>
  nativeCurrencies.includes(paymentMethod as NativeCurrencies);
