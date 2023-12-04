import { BaseErrorCodes } from "./base-error-codes";

export enum SoulNameErrorCodes {
  /**
   * Arweave related issues
   */
  ArweaveError = "ArweaveError",
  /**
   * @description Soulname Already taken or does not exists
   */
  SoulNameError = "SoulNameError",
}

export type CreateSoulNameErrorCodes = SoulNameErrorCodes | BaseErrorCodes;
