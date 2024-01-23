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
  loadSoulNamesWithExpired,
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
  public list = (address?: string): Promise<SoulNameDetails[]> =>
    listSoulNames(this.masa, address);

  /**
   *
   * @param limit
   */
  public tail = (limit?: number): Promise<SoulNameDetails[]> =>
    tailSoulNames(this.masa, limit);

  /**
   *
   * @param soulName
   */
  public resolve = (soulName: string): Promise<string | undefined> =>
    resolveSoulName(this.masa, soulName);

  /**
   *
   * @param identityIdOrAddress
   */
  public loadSoulNames = (
    identityIdOrAddress: BigNumber | string,
  ): Promise<string[]> => loadSoulNames(this.masa, identityIdOrAddress);

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
  public loadSoulNameByName = (
    soulName: string,
  ): Promise<SoulNameDetails | undefined> =>
    loadSoulNameByName(this.masa, soulName);

  /**
   *
   * @param tokenId
   */
  public loadSoulNameByTokenId = (
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
  public create = (
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
  public burn = (soulName: string): Promise<BaseResult> =>
    burnSoulName(this.masa, soulName);

  /**
   *
   * @param soulName
   * @param years
   */
  public renew = (soulName: string, years: number): Promise<BaseResult> =>
    renewSoulName(this.masa, soulName, years);

  /**
   *
   * @param soulName
   * @param receiver
   */
  public send = (soulName: string, receiver: string): Promise<BaseResult> =>
    sendSoulName(this.masa, soulName, receiver);

  /**
   *
   * @param soulName
   */
  public verify = (soulName: string): Promise<VerifyResult> =>
    verifyByName(this.masa, soulName);

  /**
   *
   * @param soulName
   */
  public validate = (
    soulName: string,
  ): {
    isValid: boolean;
    length: number;
    message?: string;
  } => validateSoulName(this.masa, soulName);

  /**
   *
   */
  public getSoulNameMetadataPrefix = (): string =>
    getSoulNameMetadataPrefix(this.masa);
}
