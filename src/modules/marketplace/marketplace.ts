import type { MasaInterface } from "../../interface";
import { MasaModuleBase } from "../masa-module-base";
import { claimAllRewards } from "./claimAllRewards";
import { stakeAll } from "./stakeAll";

export class MasaMarketplace extends MasaModuleBase {
  constructor(masa: MasaInterface) {
    super(masa, masa.contracts.instances.DataPointsMulti);
  }

  stakeAll = () => stakeAll(this.masa);
  claimAllRewards = () => claimAllRewards(this.masa);
}
