import { getBalances } from "./get-balances";
import { MasaBase } from "../helpers/masa-base";

export class MasaAccount extends MasaBase {
  getBalances = (address?: string) => getBalances(this.masa, address);
}
