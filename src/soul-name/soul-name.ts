import { BigNumber } from "ethers";
import { PaymentMethod } from "../contracts";
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
import { getSoulNameMetadataPrefix, validateSoulName } from "./validate";
import { MasaBase } from "../helpers/masa-base";
import Masa from "../masa";

export class MasaSoulName extends MasaBase {
  constructor(masa: Masa) {
    super(masa);
  }

  getRegistrationPrice = (
    soulName: string,
    duration: number,
    paymentMethod: PaymentMethod
  ) => getRegistrationPrice(this.masa, soulName, duration, paymentMethod);
  list = (address?: string) => listSoulNames(this.masa, address);
  loadSoulNamesByIdentityId = (identityId: BigNumber) =>
    loadSoulNamesByIdentityId(this.masa, identityId);
  loadSoulNameByName = (soulName: string) =>
    loadSoulNameByName(this.masa, soulName);
  loadSoulNameByTokenId = (tokenId: string | BigNumber) =>
    loadSoulNameByTokenId(this.masa, tokenId);
  create = (soulName: string, duration: number, paymentMethod: PaymentMethod) =>
    createSoulName(this.masa, soulName, duration, paymentMethod);
  burn = (soulName: string) => burnSoulName(this.masa, soulName);
  send = (soulName: string, receiver: string) =>
    sendSoulName(this.masa, soulName, receiver);
  verify = (soulName: string) => verifyByName(this.masa, soulName);
  validate = (soulName: string) => validateSoulName(this.masa, soulName);
  getSoulNameMetadataPrefix = () => getSoulNameMetadataPrefix(this.masa);
}
