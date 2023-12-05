import {
  MasaSBT__factory,
  MasaSBTDynamic,
} from "@masa-finance/masa-contracts-identity";

import type { ContractFactory } from "../../../interface/contract-factory";
import { MasaBase } from "../../../masa-base";
import { MasaDynamicSBTWrapper } from "./masa-dynamic-sbt-wrapper";

export class MasaDynamicSBTBase extends MasaBase {
  /**
   *
   * @param contract
   */
  public attach = <Contract extends MasaSBTDynamic>(
    contract: Contract,
  ): MasaDynamicSBTWrapper<Contract> => {
    return new MasaDynamicSBTWrapper<Contract>(this.masa, contract);
  };

  /**
   *
   * @param address
   * @param factory
   */
  public connect = async <Contract extends MasaSBTDynamic>(
    address: string,
    factory: ContractFactory = MasaSBT__factory,
  ): Promise<MasaDynamicSBTWrapper<Contract>> => {
    const { contract } = await this.masa.contracts.sbt.connect<Contract>(
      address,
      factory,
    );

    return this.attach<Contract>(contract);
  };
}
