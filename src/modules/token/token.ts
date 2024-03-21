import { NetworkName } from "../../interface";
import { MasaBase } from "../../masa-base";
import { deposit } from "./deposit";
import { swap } from "./swap";
import { withdraw } from "./withdraw";

export class MasaToken extends MasaBase {
  swap = (to: NetworkName, amount: string, slippage?: number) =>
    swap(this.masa, to, amount, slippage);
  deposit = (amount: string) => deposit(this.masa, amount);
  withdraw = (amount: string) => withdraw(this.masa, amount);
}
