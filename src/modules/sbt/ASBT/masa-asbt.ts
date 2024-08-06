import type { ReferenceSBTAuthority } from "@masa-finance/masa-contracts-identity";
import { ReferenceSBTAuthority__factory } from "@masa-finance/masa-contracts-identity";

import type { ContractFactory } from "../../../interface/contract-factory";
import { MasaBase } from "../../../masa-base";
import { MasaASBTWrapper } from "./masa-asbt-wrapper";

export class MasaASBT extends MasaBase {
  /**
   *
   * @param contract
   */
  public attach = <Contract extends ReferenceSBTAuthority>(
    contract: Contract,
  ): MasaASBTWrapper<Contract> => {
    return new MasaASBTWrapper<Contract>(this.masa, contract);
  };

  /**
   *
   * @param address
   * @param factory
   */
  public connect = async <Contract extends ReferenceSBTAuthority>(
    address: string,
    factory: ContractFactory = ReferenceSBTAuthority__factory,
  ): Promise<MasaASBTWrapper<Contract>> => {
    const { contract } = await this.masa.contracts.asbt.connect<Contract>(
      address,
      factory,
    );

    return this.attach(contract);
  };
}
