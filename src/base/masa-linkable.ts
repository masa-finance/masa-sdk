import type { Contract } from "ethers";

import type { MasaInterface } from "../interface";
import { MasaSoulLinker } from "../modules/soul-linker/soul-linker";
import { MasaBase } from "./masa-base";

interface d {
  readonly links: MasaSoulLinker;
}

export abstract class MasaLinkable<LinkContract extends Contract>
  extends MasaBase
  implements d
{
  public readonly links: MasaSoulLinker;

  public constructor(
    masa: MasaInterface,
    public readonly contract: LinkContract
  ) {
    super(masa);

    this.links = new MasaSoulLinker(masa, contract);
  }
}
