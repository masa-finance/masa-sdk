import { PaymentMethod } from "../contracts";
import { createIdentity, createIdentityWithSoulName } from "./create";
import { loadIdentityByAddress } from "./load";
import { burnIdentity } from "./burn";
import { showIdentity } from "./show";
import Masa from "../masa";

export const identity = (masa: Masa) => ({
  create: () => createIdentity(masa),
  createWithSoulName: (
    soulName: string,
    duration: number,
    paymentMethod: PaymentMethod
  ) => createIdentityWithSoulName(masa, soulName, duration, paymentMethod),
  load: (address?: string) => loadIdentityByAddress(masa, address),
  burn: () => burnIdentity(masa),
  show: (address?: string) => showIdentity(masa, address),
});
