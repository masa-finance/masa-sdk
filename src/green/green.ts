import { createGreen } from "./create";
import { burnGreen } from "./burn";
import { listGreens, loadGreensByIdentityId } from "./list";
import { BigNumber } from "ethers";
import Masa from "../masa";
import { MasaSoulLinker } from "../soul-linker";

export class MasaGreen {
  public readonly links: MasaSoulLinker;

  constructor(private masa: Masa) {
    this.links = new MasaSoulLinker(
      this.masa,
      this.masa.contracts.instances.Soulbound2FAContract
    );
  }

  generate = (phoneNumber: string) =>
    this.masa.client.green.generate(phoneNumber);
  create = (phoneNumber: string, code: string) =>
    createGreen(this.masa, phoneNumber, code);
  burn = (greenId: number) => burnGreen(this.masa, greenId);
  list = (address?: string) => listGreens(this.masa, address);
  load = (identityId: BigNumber) =>
    loadGreensByIdentityId(this.masa, identityId);
}
