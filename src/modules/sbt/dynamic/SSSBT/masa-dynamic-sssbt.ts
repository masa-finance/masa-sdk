import type { ReferenceSBTDynamicSelfSovereign } from "@masa-finance/masa-contracts-identity";
import { ReferenceSBTDynamicSelfSovereign__factory } from "@masa-finance/masa-contracts-identity";

import type { ContractFactory } from "../../../../interface/contract-factory";
import { MasaBase } from "../../../../masa-base";
import { MasaDynamicSSSBTWrapper } from "./masa-dynamic-sssbt-wrapper";

export class MasaDynamicSSSBT extends MasaBase {
  /**
   *
   * @param contract
   */
  public attach = <Contract extends ReferenceSBTDynamicSelfSovereign>(
    contract: Contract,
  ): MasaDynamicSSSBTWrapper<Contract> => {
    return new MasaDynamicSSSBTWrapper<Contract>(this.masa, contract);
  };

  /**
   *
   * @param address
   * @param factory
   */
  public connect = async <Contract extends ReferenceSBTDynamicSelfSovereign>(
    address: string,
    factory: ContractFactory = ReferenceSBTDynamicSelfSovereign__factory,
  ): Promise<MasaDynamicSSSBTWrapper<Contract>> => {
    const { contract } = await this.masa.contracts[
      "dynamic-sssbt"
    ].connect<Contract>(address, factory);

    return this.attach<Contract>(contract);
  };
}
