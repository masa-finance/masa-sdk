import type { MasaSBTDynamic } from "@masa-finance/masa-contracts-identity";
import { MasaSBTDynamic__factory } from "@masa-finance/masa-contracts-identity";

import type { ContractFactory } from "../../../../interface/contract-factory";
import { MasaSBTModuleBase } from "../masa-sbt-module-base";
import { DynamicSBTContractWrapper } from "./dynamic-sbt-contract-wrapper";

export class DynamicSBTContract extends MasaSBTModuleBase {
  /**
   *
   * @param contract
   */
  public attach = <Contract extends MasaSBTDynamic>(
    contract: Contract,
  ): DynamicSBTContractWrapper<Contract> => {
    return new DynamicSBTContractWrapper<Contract>(
      this.masa,
      this.instances,
      contract,
    );
  };

  /**
   * loads an sbt instance and connects the contract functions to it
   * @param address
   * @param factory
   */
  public connect = async <Contract extends MasaSBTDynamic>(
    address: string,
    factory: ContractFactory = MasaSBTDynamic__factory,
  ): Promise<DynamicSBTContractWrapper<Contract>> => {
    const contract: Contract = await this.loadSBTContract<Contract>(
      address,
      factory,
    );

    return this.attach<Contract>(contract);
  };
}
