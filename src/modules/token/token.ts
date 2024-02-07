import { NetworkName } from "../../interface";
import { MasaBase } from "../../masa-base";
import { swap } from "./swap";

export class MasaToken extends MasaBase {
  swap = (to: NetworkName, amount: string, slippage?: number) =>
    swap(this.masa, to, amount, slippage);
}
