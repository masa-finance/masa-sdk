import { getBalances } from "./getBalances";
import Masa from "../masa";

export const account = (mass: Masa) => ({
  getBalances: (address: string) => getBalances(mass, address),
});
