import { ILinkableSBT } from "@masa-finance/masa-contracts-identity";

import type { MasaInterface } from "../interface";
import { MasaBase } from "../masa-base";
import { MasaSoulLinker } from "./soul-linker";

export abstract class MasaLinkable<
  LinkContract extends ILinkableSBT,
> extends MasaBase {
  public readonly links: MasaSoulLinker;

  public constructor(
    masa: MasaInterface,
    public readonly contract: LinkContract,
  ) {
    super(masa);

    this.links = new MasaSoulLinker(masa, contract);
  }
}
