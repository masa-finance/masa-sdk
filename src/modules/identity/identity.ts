import { BigNumber } from "@ethersproject/bignumber";

import type {
  BaseResult,
  BaseResultWithTokenId,
  CreateSoulNameResult,
  IdentityDetails,
  PaymentMethod,
} from "../../interface";
import { MasaBase } from "../../masa-base";
import { burnIdentity } from "./burn";
import { createIdentity, createIdentityWithSoulName } from "./create";
import { loadIdentityByAddress } from "./load";
import { showIdentity } from "./show";

export class MasaIdentity extends MasaBase {
  public create = (): Promise<BaseResultWithTokenId> =>
    createIdentity(this.masa);
  public createWithSoulName = (
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
  public load = (
    address?: string,
  ): Promise<{
    identityId?: BigNumber;
    address: string;
  }> => loadIdentityByAddress(this.masa, address);
  public burn = (): Promise<BaseResult> => burnIdentity(this.masa);
  public show = (address?: string): Promise<IdentityDetails | undefined> =>
    showIdentity(this.masa, address);
}
