import type { ReferenceSBTAuthority } from "@masa-finance/masa-contracts-identity";
import { MasaSBTAuthority__factory } from "@masa-finance/masa-contracts-identity";

import { ContractFactory } from "../../../../interface/contract-factory";
import { MasaSBTModuleBase } from "../masa-sbt-module-base";
import { ASBTContractWrapper } from "./asbt-contract-wrapper";

export class ASBTContract extends MasaSBTModuleBase {
  /**
   *
   * @param contract
   */
  public attach = <Contract extends ReferenceSBTAuthority>(
    contract: Contract
  ): ASBTContractWrapper<Contract> => {
    return new ASBTContractWrapper<Contract>(
      this.masa,
      this.instances,
      contract
    );
  };

  /**
   *
   * @param address
   * @param factory
   */
  public connect = async <Contract extends ReferenceSBTAuthority>(
    address: string,
    factory: ContractFactory = MasaSBTAuthority__factory
  ): Promise<ASBTContractWrapper<Contract>> => {
    const contract: Contract = await this.loadSBTContract<Contract>(
      address,
      factory
    );

    return this.attach<Contract>(contract);
  };
}
