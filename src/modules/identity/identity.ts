import { BigNumber } from "@ethersproject/bignumber";

import type { BaseResult, PaymentMethod } from "../../interface";
import {
  BaseResultWithTokenId,
  CreateSoulNameResult,
  IdentityDetails,
} from "../../interface";
import { MasaBase } from "../../masa-base";
import { burnIdentity } from "./burn";
import { createIdentity, createIdentityWithSoulName } from "./create";
import { loadIdentityByAddress } from "./load";
import { showIdentity } from "./show";

export class MasaIdentity extends MasaBase {
  create = (): Promise<BaseResultWithTokenId> => createIdentity(this.masa);
  createWithSoulName = (
    paymentMethod: PaymentMethod,
    soulName: string,
    duration: number,
    style?: string,
  ): Promise<
    {
      identityId?: string | BigNumber;
    } & CreateSoulNameResult
  > =>
    createIdentityWithSoulName(
      this.masa,
      paymentMethod,
      soulName,
      duration,
      style,
    );
  load = (
    address?: string,
  ): Promise<{
    identityId?: BigNumber;
    address: string;
  }> => loadIdentityByAddress(this.masa, address);
  burn = (): Promise<BaseResult> => burnIdentity(this.masa);
  show = (address?: string): Promise<IdentityDetails | undefined> =>
    showIdentity(this.masa, address);
}
