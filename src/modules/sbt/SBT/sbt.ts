import {
  MasaSBT,
  MasaSBT__factory,
} from "@masa-finance/masa-contracts-identity";

import { MasaBase } from "../../../base/masa-base";
import type { ContractFactory } from "../../../contracts";
import { SBTWrapper } from "./sbt-wrapper";

export class MasaSBTs extends MasaBase {
  /**
   *
   * @param sbtContract
   */
  public attach = <Contract extends MasaSBT>(sbtContract: Contract) => {
    return new SBTWrapper<Contract>(this.masa, sbtContract);
  };

  /**
   *
   * @param address
   * @param factory
   */
  public connect = async <Contract extends MasaSBT>(
    address: string,
    factory: ContractFactory = MasaSBT__factory
  ) => {
    const { sbtContract } =
      (await this.masa.contracts.sbt.connect<Contract>(address, factory)) || {};

    return this.attach<Contract>(sbtContract);
  };
}
