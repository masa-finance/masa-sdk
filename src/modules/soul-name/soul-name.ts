import type { BigNumber } from "@ethersproject/bignumber";

import type { MasaInterface, PaymentMethod } from "../../interface";
import { MasaModuleBase } from "../masa-module-base";
import { burnSoulName } from "./burn";
import { createSoulName } from "./create";
import { getSoulNameMetadataPrefix } from "./helpers";
import { listSoulNames } from "./list";
import {
  loadSoulNameByName,
  loadSoulNameByTokenId,
  loadSoulNames,
  loadSoulNamesWithExpired,
} from "./load";
import { renewSoulName } from "./renew";
import { resolveSoulName } from "./resolve";
import { sendSoulName } from "./send";
import { tailSoulNames } from "./tail";
import { validateSoulName } from "./validate";
import { verifyByName } from "./verify";

export class MasaSoulName extends MasaModuleBase {
  constructor(masa: MasaInterface) {
    super(masa, masa.contracts.instances.SoulNameContract);
  }

  /**
   *
   * @param address
   */
  list = (address?: string) => listSoulNames(this.masa, address);

  /**
   *
   * @param limit
   */
  tail = (limit?: number) => tailSoulNames(this.masa, limit);

  /**
   *
   * @param soulName
   */
  resolve = (soulName: string) => resolveSoulName(this.masa, soulName);

  /**
   *
   * @param identityIdOrAddress
   */
  loadSoulNames = (identityIdOrAddress: BigNumber | string) =>
    loadSoulNames(this.masa, identityIdOrAddress);

  /**
   *
   * @param identityIdOrAddress
   */
  loadSoulNamesWithExpired = (identityIdOrAddress: BigNumber | string) =>
    loadSoulNamesWithExpired(this.masa, identityIdOrAddress);

  /**
   *
   * @param soulName
   */
  loadSoulNameByName = (soulName: string) =>
    loadSoulNameByName(this.masa, soulName);

  /**
   *
   * @param tokenId
   */
  loadSoulNameByTokenId = (tokenId: string | BigNumber) =>
    loadSoulNameByTokenId(this.masa, tokenId);

  /**
   *
   * @param paymentMethod
   * @param soulName
   * @param duration
   * @param receiver
   * @param style
   */
  create = (
    paymentMethod: PaymentMethod = "ETH",
    soulName: string,
    duration: number,
    receiver?: string,
    style?: string,
  ) =>
    createSoulName(
      this.masa,
      paymentMethod,
      soulName,
      duration,
      receiver,
      style,
    );

  /**
   *
   * @param soulName
   */
  burn = (soulName: string) => burnSoulName(this.masa, soulName);

  /**
   *
   * @param soulName
   * @param years
   */
  renew = (soulName: string, years: number) =>
    renewSoulName(this.masa, soulName, years);

  /**
   *
   * @param soulName
   * @param receiver
   */
  send = (soulName: string, receiver: string) =>
    sendSoulName(this.masa, soulName, receiver);

  /**
   *
   * @param soulName
   */
  verify = (soulName: string) => verifyByName(this.masa, soulName);

  /**
   *
   * @param soulName
   */
  validate = (soulName: string) => validateSoulName(this.masa, soulName);

  /**
   *
   */
  getSoulNameMetadataPrefix = () => getSoulNameMetadataPrefix(this.masa);
}
