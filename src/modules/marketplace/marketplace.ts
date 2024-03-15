import { MasaBase } from "../../masa-base";
import { claimAllRewards } from "./claimAllRewards";
import { stakeAll } from "./stakeAll";

export class MasaMarketplace extends MasaBase {
  stakeAll = () => stakeAll(this.masa);
  claimAllRewards = () => claimAllRewards(this.masa);
}
