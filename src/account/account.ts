import { getBalances } from "./get-balances";
import Masa from "../masa";

export const account = (mass: Masa) => ({
  getBalances: (address: string) => getBalances(mass, address),
});
