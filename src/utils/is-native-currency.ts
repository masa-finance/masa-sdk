import { nativeCurrencies } from "../collections";
import type { NativeCurrencies } from "../interface";

export const isNativeCurrency = (
  paymentMethod: unknown,
): paymentMethod is NativeCurrencies =>
  nativeCurrencies.includes(paymentMethod as NativeCurrencies);
