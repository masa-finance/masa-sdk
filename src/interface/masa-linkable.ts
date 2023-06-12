import { Contract } from "ethers";

import { MasaSoulLinker } from "../soul-linker";
import { MasaBase } from "./masa-base";
import type { MasaInterface } from "./masa-interface";

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
