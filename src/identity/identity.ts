import { SoulboundIdentity } from "@masa-finance/masa-contracts-identity";

import { MasaInterface } from "../interface/masa-interface";
import { MasaLinkable } from "../interface/masa-linkable";
import { PaymentMethod } from "../interface/payment-method";
import { burnIdentity } from "./burn";
import { createIdentity, createIdentityWithSoulName } from "./create";
import { loadIdentityByAddress } from "./load";
import { showIdentity } from "./show";

export class MasaIdentity extends MasaLinkable<SoulboundIdentity> {
  constructor(masa: MasaInterface) {
    super(masa, masa.contracts.instances.SoulboundIdentityContract);
  }

  create = () => createIdentity(this.masa);
  createWithSoulName = (
    paymentMethod: PaymentMethod,
    soulName: string,
    duration: number,
    style?: string
  ) =>
    createIdentityWithSoulName(
      this.masa,
      paymentMethod,
      soulName,
      duration,
      style
    );
  load = (address?: string) => loadIdentityByAddress(this.masa, address);
  burn = () => burnIdentity(this.masa);
  show = (address?: string) => showIdentity(this.masa, address);
}
