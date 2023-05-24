import Masa from "../masa";
import { MasaSoulLinker } from "../soul-linker";
import { Contract } from "ethers";
import { MasaBase } from "./masa-base";

export class MasaLinkable<LinkContract extends Contract> extends MasaBase {
  public readonly links: MasaSoulLinker;

  public constructor(masa: Masa, public readonly contract: LinkContract) {
    super(masa);

    this.links = new MasaSoulLinker(masa, contract);
  }
}
