import type { ReferenceSBTSelfSovereign } from "@masa-finance/masa-contracts-identity";
import { MasaSBTSelfSovereign__factory } from "@masa-finance/masa-contracts-identity";

import { MasaModuleBase } from "../../../../base";
import type { ContractFactory } from "../../contract-factory";
import { SSSBTContractWrapper } from "./sssbt-contract-wrapper";

export class SSSBTContract extends MasaModuleBase {
  /**
   *
   * @param contract
   */
  public attach = <Contract extends ReferenceSBTSelfSovereign>(
    contract: Contract
  ): SSSBTContractWrapper<Contract> => {
    return new SSSBTContractWrapper(this.masa, this.instances, contract);
  };

  /**
   *
   * @param address
   * @param factory
   */
  public connect = async <Contract extends ReferenceSBTSelfSovereign>(
    address: string,
    factory: ContractFactory = MasaSBTSelfSovereign__factory
  ): Promise<SSSBTContractWrapper<Contract>> => {
    const contract: Contract = await this.loadSBTContract<Contract>(
      address,
      factory
    );

    return this.attach<Contract>(contract);
  };
}
