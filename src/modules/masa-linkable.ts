import { Contract } from "ethers";

import { type ContractInfo, MasaInterface } from "../interface";
import { MasaModuleBase } from "./masa-module-base";
import { MasaSoulLinker } from "./soul-linker";

export abstract class MasaLinkable<
  LinkContract extends Contract & ContractInfo,
> extends MasaModuleBase {
  public readonly links: MasaSoulLinker;

  public constructor(
    masa: MasaInterface,
    public readonly contract: LinkContract,
  ) {
    super(masa, contract);

    this.links = new MasaSoulLinker(masa, contract);
  }
}
