import { BigNumber } from "ethers";
import { PaymentMethod } from "../contracts";
import Masa from "../masa";
import { burnSoulName } from "./burn";
import { createSoulName, getRegistrationPrice } from "./create";
import {
  listSoulNames,
  loadSoulNameByName,
  loadSoulNameByTokenId,
  loadSoulNamesByIdentityId,
} from "./list";
import { sendSoulName } from "./send";
import { verifyByName } from "./verify";
import { validateSoulName } from "./validate"

export const soulNames = (masa: Masa) => ({
  getRegistrationPrice: (
    soulName: string,
    duration: number,
    paymentMethod: PaymentMethod
  ) => getRegistrationPrice(masa, soulName, duration, paymentMethod),
  list: (address?: string) => listSoulNames(masa, address),
  loadSoulNamesByIdentityId: (identityId: BigNumber) =>
    loadSoulNamesByIdentityId(masa, identityId),
  loadSoulNameByName: (soulName: string) => loadSoulNameByName(masa, soulName),
  loadSoulNameByTokenId: (tokenId: string | BigNumber) =>
    loadSoulNameByTokenId(masa, tokenId),
  create: (soulName: string, duration: number, paymentMethod: PaymentMethod) =>
    createSoulName(masa, soulName, duration, paymentMethod),
  burn: (soulName: string) => burnSoulName(masa, soulName),
  send: (soulName: string, receiver: string) =>
    sendSoulName(masa, soulName, receiver),
  verify: (soulName: string) => verifyByName(masa, soulName),
  validate: (soulName: string) => validateSoulName(masa, soulName),
});
