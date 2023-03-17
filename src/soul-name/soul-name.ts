import { BigNumber } from "ethers";
import { PaymentMethod } from "../contracts";
import { burnSoulName } from "./burn";
import { createSoulName, getRegistrationPrice } from "./create";
import {
  listSoulNames,
  loadSoulNameByName,
  loadSoulNameByTokenId,
  loadSoulNamesByIdentityId,
  resolve,
} from "./list";
import { sendSoulName } from "./send";
import { verifyByName } from "./verify";
import { getSoulNameMetadataPrefix, validateSoulName } from "./validate";
import { MasaBase } from "../helpers/masa-base";

export class MasaSoulName extends MasaBase {
  getRegistrationPrice = (
    paymentMethod: PaymentMethod = "eth",
    soulName: string,
    duration: number
  ) => getRegistrationPrice(this.masa, paymentMethod, soulName, duration);
  list = (address?: string) => listSoulNames(this.masa, address);
  resolve = (soulName: string) => resolve(this.masa, soulName);
  loadSoulNamesByIdentityId = (identityId: BigNumber) =>
    loadSoulNamesByIdentityId(this.masa, identityId);
  loadSoulNameByName = (soulName: string) =>
    loadSoulNameByName(this.masa, soulName);
  loadSoulNameByTokenId = (tokenId: string | BigNumber) =>
    loadSoulNameByTokenId(this.masa, tokenId);
  create = (
    paymentMethod: PaymentMethod = "eth",
    soulName: string,
    duration: number,
    receiver?: string
  ) => createSoulName(this.masa, paymentMethod, soulName, duration, receiver);
  burn = (soulName: string) => burnSoulName(this.masa, soulName);
  send = (soulName: string, receiver: string) =>
    sendSoulName(this.masa, soulName, receiver);
  verify = (soulName: string) => verifyByName(this.masa, soulName);
  validate = (soulName: string) => validateSoulName(this.masa, soulName);
  getSoulNameMetadataPrefix = () => getSoulNameMetadataPrefix(this.masa);
}
