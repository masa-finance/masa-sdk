import { MasaBase } from "../interface";
import { getBalances } from "./get-balances";

export class MasaAccount extends MasaBase {
  getBalances = (address?: string) => getBalances(this.masa, address);
}
