import {
  ReferenceSBTAuthority,
  ReferenceSBTAuthority__factory,
} from "@masa-finance/masa-contracts-identity";

import { MasaBase } from "../../../base/masa-base";
import { ContractFactory } from "../../../contracts/modules/contract-factory";
import { MasaASBTWrapper } from "./asbt-wrapper";
import { deployASBT } from "./deploy";

export class MasaASBT extends MasaBase {
  /**
   *
   * @param name
   * @param symbol
   * @param baseTokenUri
   * @param limit
   * @param adminAddress
   */
  public deploy = ({
    name,
    symbol,
    baseTokenUri,
    limit = 1,
    adminAddress,
  }: {
    name: string;
    symbol: string;
    baseTokenUri: string;
    limit?: number;
    adminAddress?: string;
  }) =>
    deployASBT({
      masa: this.masa,
      name,
      symbol,
      baseTokenUri,
      limit,
      adminAddress,
    });

  /**
   *
   * @param contract
   */
  public attach = <Contract extends ReferenceSBTAuthority>(
    contract: Contract
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
    factory: ContractFactory = ReferenceSBTAuthority__factory
  ): Promise<MasaASBTWrapper<Contract>> => {
    const { contract } = await this.masa.contracts.asbt.connect<Contract>(
      address,
      factory
    );

    return this.attach(contract);
  };
}
