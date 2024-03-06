import { BigNumber } from "ethers";

import { MasaBase } from "../../masa-base";
import { stake } from "./stake";

export class MasaMarketplace extends MasaBase {
  stake = (tokenId: BigNumber, amount: BigNumber) =>
    stake(this.masa, tokenId, amount);
}
