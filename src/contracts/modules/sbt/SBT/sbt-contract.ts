import type { MasaSBT } from "@masa-finance/masa-contracts-identity";
import { MasaSBT__factory } from "@masa-finance/masa-contracts-identity";

import { MasaModuleBase } from "../../../../base";
import type { ContractFactory } from "../../contract-factory";
import { SBTContractWrapper } from "./sbt-contract-wrapper";

export class SBTContract extends MasaModuleBase {
  /**
   *
   * @param sbtContract
   */
  public attach = <Contract extends MasaSBT>(
    sbtContract: Contract
  ): SBTContractWrapper<Contract> => {
    return new SBTContractWrapper<Contract>(
      this.masa,
      this.instances,
      sbtContract
    );
  };

  /**
   * loads an sbt instance and connects the contract functions to it
   * @param address
   * @param factory
   */
  public connect = async <Contract extends MasaSBT>(
    address: string,
    factory: ContractFactory = MasaSBT__factory
  ): Promise<SBTContractWrapper<Contract>> => {
    const sbtContract: Contract = await SBTContract.loadSBTContract<Contract>(
      this.masa.config,
      address,
      factory
    );

    return this.attach<Contract>(sbtContract);
  };
}
