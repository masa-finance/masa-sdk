import { BigNumber } from "ethers";
import { PaymentMethod } from "../contracts";
import Masa from "../masa";
import { burnSoulName } from "./burn";
import { createSoulName } from "./create";
import { listSoulnames, loadSoulNamesByIdentityId } from "./list";

export const soulNames = (masa: Masa) => ({
  list: (address?: string) => listSoulnames(masa, address),
  loadSoulNamesByIdentityId: (identityId: BigNumber) =>
    loadSoulNamesByIdentityId(masa, identityId),
  create: (soulName: string, duration: number, paymentMethod: PaymentMethod) =>
    createSoulName(masa, soulName, duration, paymentMethod),
  burn: (soulName: string) => burnSoulName(masa, soulName),
});
