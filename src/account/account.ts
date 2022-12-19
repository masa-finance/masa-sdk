import { getBalances } from "./get-balances";
import Masa from "../masa";

export class MasaAccount {
  constructor(private mass: Masa) {
  }

  getBalances = (address?: string) => getBalances(this.mass, address);
}
