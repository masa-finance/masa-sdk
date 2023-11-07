import type { MasaDynamicSSSBT } from "@masa-finance/masa-contracts-identity";
import { MasaDynamicSSSBT__factory } from "@masa-finance/masa-contracts-identity";

import type { ContractFactory } from "../../../../../interface/contract-factory";
import { MasaSBTModuleBase } from "../../masa-sbt-module-base";
import { DynamicSSSBTContractWrapper } from "./dynamic-sssbt-contract-wrapper";

export class DynamicSSSBTContract extends MasaSBTModuleBase {
  /**
   *
   * @param contract
   */
  public attach = <Contract extends MasaDynamicSSSBT>(
    contract: Contract,
  ): DynamicSSSBTContractWrapper<Contract> => {
    return new DynamicSSSBTContractWrapper(this.masa, this.instances, contract);
  };

  /**
   *
   * @param address
   * @param factory
   */
  public connect = async <Contract extends MasaDynamicSSSBT>(
    address: string,
    factory: ContractFactory = MasaDynamicSSSBT__factory,
  ): Promise<DynamicSSSBTContractWrapper<Contract>> => {
    const contract: Contract = await this.loadSBTContract<Contract>(
      address,
      factory,
    );

    return this.attach<Contract>(contract);
  };
}
