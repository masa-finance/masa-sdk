import { PaymentMethod } from "../interface";
import Masa from "../masa";
import {
  burnIdentity,
  createIdentity,
  createIdentityWithSoulName,
  loadIdentityByAddress,
  showIdentity,
} from "./";
import { MasaLinkable } from "../helpers/masa-linkable";

export class MasaIdentity extends MasaLinkable {
  constructor(masa: Masa) {
    super(masa, masa.contracts.instances.SoulboundIdentityContract);
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
