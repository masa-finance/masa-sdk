import { Contract } from "ethers";

import { type ContractInfo, MasaInterface } from "../interface";
import { MasaBase } from "../masa-base";

export abstract class MasaModuleBase extends MasaBase {
  public constructor(
    masa: MasaInterface,
    public readonly contract: Contract & ContractInfo,
  ) {
    super(masa);
  }

  public get isContractAvailable(): boolean {
    return this.contract.hasAddress ?? false;
  }
}
