import type { Contract } from "ethers";

import type { MasaInterface } from "../interface";
import { MasaBase } from "../masa-base";
import { MasaSoulLinker } from "../modules/soul-linker";

export abstract class MasaLinkable<
  LinkContract extends Contract
> extends MasaBase {
  public readonly links: MasaSoulLinker;

  public constructor(
    masa: MasaInterface,
    public readonly contract: LinkContract
  ) {
    super(masa);

    this.links = new MasaSoulLinker(masa, contract);
  }
}
