import Masa from "../masa";
import { MasaSoulLinker } from "../soul-linker";
import { Contract } from "ethers";
import { MasaBase } from "./masa-base";

export class MasaLinkable extends MasaBase {
  public readonly links: MasaSoulLinker;

  public constructor(protected masa: Masa, protected contract: Contract) {
    super(masa);
    this.links = new MasaSoulLinker(this.masa, contract);
  }
}
