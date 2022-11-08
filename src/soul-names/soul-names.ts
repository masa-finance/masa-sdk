import { BigNumber } from "ethers";
import { PaymentMethod } from "../contracts";
import Masa from "../masa";
import { burnSoulName } from "./burn";
import { createSoulName, getRegistrationPrice } from "./create";
import { listSoulNames, loadSoulNamesByIdentityId } from "./list";

export const soulNames = (masa: Masa) => ({
  getRegistrationPrice: (
    soulName: string,
    duration: number,
    paymentMethod: PaymentMethod
  ) => getRegistrationPrice(masa, soulName, duration, paymentMethod),
  list: (address?: string) => listSoulNames(masa, address),
  loadSoulNamesByIdentityId: (identityId: BigNumber) =>
    loadSoulNamesByIdentityId(masa, identityId),
  create: (soulName: string, duration: number, paymentMethod: PaymentMethod) =>
    createSoulName(masa, soulName, duration, paymentMethod),
  burn: (soulName: string) => burnSoulName(masa, soulName),
});
