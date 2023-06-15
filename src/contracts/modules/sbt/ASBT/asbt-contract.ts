import type { ReferenceSBTAuthority } from "@masa-finance/masa-contracts-identity";
import { MasaSBTAuthority__factory } from "@masa-finance/masa-contracts-identity";

import { MasaModuleBase } from "../../../../base";
import { ContractFactory } from "../../contract-factory";
import { ASBTContractWrapper } from "./asbt-contract-wrapper";

export class ASBTContract extends MasaModuleBase {
  /**
   *
   * @param sbtContract
   */
  public attach = <Contract extends ReferenceSBTAuthority>(
    sbtContract: Contract
  ): ASBTContractWrapper<Contract> => {
    return new ASBTContractWrapper<Contract>(
      this.masa,
      this.instances,
      sbtContract
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
    const sbtContract: Contract = await ASBTContract.loadSBTContract<Contract>(
      this.masa.config,
      address,
      factory
    );

    return this.attach<Contract>(sbtContract);
  };
}
