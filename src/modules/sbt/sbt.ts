import { MasaSBT__factory } from "@masa-finance/masa-contracts-identity";

import { MasaBase } from "../../base";
import type { ContractFactory } from "../../contracts";
import { SBTWrapper } from "./SBTWrapper";

export class MasaSBTs extends MasaBase {
  /**
   *
   * @param address
   * @param factory
   */
  public connect = async (
    address: string,
    factory: ContractFactory = MasaSBT__factory
  ) => {
    const { sbtContract } =
      (await this.masa.contracts.sbt.connect(address, factory)) || {};

    return new SBTWrapper(this.masa, sbtContract);
  };
}
