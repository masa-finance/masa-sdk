import { MasaBase } from "../../masa-base";
import { Balances, getBalances } from "./get-balances";

export class MasaAccount extends MasaBase {
  getBalances = (address?: string): Promise<Balances> =>
    getBalances(this.masa, address);
}
