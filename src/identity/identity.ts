import { PaymentMethod } from "../contracts";
import { createIdentity, createIdentityWithSoulName } from "./create";
import { loadIdentityByAddress } from "./load";
import { burnIdentity } from "./burn";
import { showIdentity } from "./show";
import Masa from "../masa";
import { MasaSoulLinker } from "../soul-linker";
import { MasaBase } from "../helpers/masa-base";

export class MasaIdentity extends MasaBase {
  public readonly links: MasaSoulLinker;

  constructor(masa: Masa) {
    super(masa);

    this.links = new MasaSoulLinker(
      this.masa,
      this.masa.contracts.instances.SoulboundIdentityContract
    );
  }

  create = () => createIdentity(this.masa);
  createWithSoulName = (
    paymentMethod: PaymentMethod,
    soulName: string,
    duration: number
  ) => createIdentityWithSoulName(this.masa, paymentMethod, soulName, duration);
  load = (address?: string) => loadIdentityByAddress(this.masa, address);
  burn = () => burnIdentity(this.masa);
  show = (address?: string) => showIdentity(this.masa, address);
}
