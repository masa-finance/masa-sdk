import { MasaSBT } from "@masa-finance/masa-contracts-identity";

import type {
  IIdentityContracts,
  MasaInterface,
  PaymentMethod,
  PriceInformation,
} from "../../../../interface";
import { MasaSBTModuleBase } from "../masa-sbt-module-base";

export class SBTContractWrapper<
  Contract extends MasaSBT,
> extends MasaSBTModuleBase {
  constructor(
    masa: MasaInterface,
    instances: IIdentityContracts,
    public readonly contract: Contract,
  ) {
    super(masa, instances);
  }

  /**
   *
   * @param paymentMethod
   * @param slippage
   */
  public getPrice = (
    paymentMethod: PaymentMethod,
    slippage: number | undefined = 250,
  ): Promise<PriceInformation> =>
    this.getMintPrice(paymentMethod, this.contract, slippage);
}
