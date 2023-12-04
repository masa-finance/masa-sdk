import type { PaymentMethod } from "../../interface";
import { MasaBase } from "../../masa-base";
import { burnIdentity } from "./burn";
import { createIdentity, createIdentityWithSoulName } from "./create";
import { loadIdentityByAddress } from "./load";
import { showIdentity } from "./show";

export class MasaIdentity extends MasaBase {
  create = () => createIdentity(this.masa);
  createWithSoulName = (
    paymentMethod: PaymentMethod,
    soulName: string,
    duration: number,
    style?: string,
  ) =>
    createIdentityWithSoulName(
      this.masa,
      paymentMethod,
      soulName,
      duration,
      style,
    );
  load = (address?: string) => loadIdentityByAddress(this.masa, address);
  burn = () => burnIdentity(this.masa);
  show = (address?: string) => showIdentity(this.masa, address);
}
