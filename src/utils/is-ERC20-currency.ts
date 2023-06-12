import { erc20Currencies } from "../collections";
import type { ERC20Currencies } from "../interface";

export const isERC20Currency = (
  paymentMethod: unknown
): paymentMethod is ERC20Currencies =>
  erc20Currencies.includes(paymentMethod as ERC20Currencies);
