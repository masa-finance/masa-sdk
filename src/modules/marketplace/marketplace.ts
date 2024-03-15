import { MasaBase } from "../../masa-base";
import { stakeAll } from "./stakeAll";
import { claimAllRewards } from "./claimAllRewards";

export class MasaMarketplace extends MasaBase {
  stakeAll = () => stakeAll(this.masa);
  claimAllRewards = () => claimAllRewards(this.masa);
}
