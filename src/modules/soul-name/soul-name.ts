import type { BigNumber } from "@ethersproject/bignumber";

import type {
  BaseResult,
  CreateSoulNameResult,
  PaymentMethod,
  SoulNameDetails,
} from "../../interface";
import { MasaBase } from "../../masa-base";
import { burnSoulName } from "./burn";
import { createSoulName } from "./create";
import { getSoulNameMetadataPrefix } from "./helpers";
import { listSoulNames } from "./list";
import {
  loadSoulNameByName,
  loadSoulNameByTokenId,
  loadSoulNames,
} from "./load";
import { renewSoulName } from "./renew";
import { resolveSoulName } from "./resolve";
import { sendSoulName } from "./send";
import { tailSoulNames } from "./tail";
import { validateSoulName } from "./validate";
import { verifyByName, VerifyResult } from "./verify";

export class MasaSoulName extends MasaBase {
  /**
   *
   * @param address
   */
  list = (address?: string): Promise<SoulNameDetails[]> =>
    listSoulNames(this.masa, address);

  /**
   *
   * @param limit
   */
  tail = (limit?: number): Promise<SoulNameDetails[]> =>
    tailSoulNames(this.masa, limit);

  /**
   *
   * @param soulName
   */
  resolve = (soulName: string): Promise<string | undefined> =>
    resolveSoulName(this.masa, soulName);

  /**
   *
   * @param identityIdOrAddress
   */
  loadSoulNames = (
    identityIdOrAddress: BigNumber | string,
  ): Promise<string[]> => loadSoulNames(this.masa, identityIdOrAddress);

  /**
   *
   * @param soulName
   */
  loadSoulNameByName = (
    soulName: string,
  ): Promise<SoulNameDetails | undefined> =>
    loadSoulNameByName(this.masa, soulName);

  /**
   *
   * @param tokenId
   */
  loadSoulNameByTokenId = (
    tokenId: string | BigNumber,
  ): Promise<SoulNameDetails | undefined> =>
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
  ): Promise<CreateSoulNameResult> =>
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
  burn = (soulName: string): Promise<BaseResult> =>
    burnSoulName(this.masa, soulName);

  /**
   *
   * @param soulName
   * @param years
   */
  renew = (soulName: string, years: number): Promise<BaseResult> =>
    renewSoulName(this.masa, soulName, years);

  /**
   *
   * @param soulName
   * @param receiver
   */
  send = (soulName: string, receiver: string): Promise<BaseResult> =>
    sendSoulName(this.masa, soulName, receiver);

  /**
   *
   * @param soulName
   */
  verify = (soulName: string): Promise<VerifyResult> =>
    verifyByName(this.masa, soulName);

  /**
   *
   * @param soulName
   */
  validate = (
    soulName: string,
  ): {
    isValid: boolean;
    length: number;
    message?: string;
  } => validateSoulName(this.masa, soulName);

  /**
   *
   */
  getSoulNameMetadataPrefix = (): string =>
    getSoulNameMetadataPrefix(this.masa);
}
