import { PaymentMethod } from "../contracts";
import { createIdentity, createIdentityWithSoulName } from "./create";
import { loadIdentityByAddress } from "./load";
import { burnIdentity } from "./burn";
import { showIdentity } from "./show";
import Masa from "../masa";
import { MasaSoulLinker } from "../soul-linker";

export class MasaIdentity {
  public readonly links: MasaSoulLinker;

  constructor(private masa: Masa) {
    this.links = new MasaSoulLinker(
      this.masa,
      this.masa.contracts.instances.SoulboundIdentityContract
    );
  }

  create = () => createIdentity(this.masa);
  createWithSoulName = (
    soulName: string,
    duration: number,
    paymentMethod: PaymentMethod
  ) => createIdentityWithSoulName(this.masa, soulName, duration, paymentMethod);
  load = (address?: string) => loadIdentityByAddress(this.masa, address);
  burn = () => burnIdentity(this.masa);
  show = (address?: string) => showIdentity(this.masa, address);
}
