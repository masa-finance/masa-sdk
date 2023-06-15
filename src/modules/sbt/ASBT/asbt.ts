import {
  ReferenceSBTAuthority,
  ReferenceSBTAuthority__factory,
} from "@masa-finance/masa-contracts-identity";

import { MasaBase } from "../../../base";
import { ContractFactory } from "../../../contracts";
import { ASBTWrapper } from "./asbt-wrapper";
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

  public attach = <Contract extends ReferenceSBTAuthority>(
    sbtContract: Contract
  ) => {
    return new ASBTWrapper<Contract>(this.masa, sbtContract);
  };

  /**
   *
   * @param address
   * @param factory
   */
  public connect = async <Contract extends ReferenceSBTAuthority>(
    address: string,
    factory: ContractFactory = ReferenceSBTAuthority__factory
  ) => {
    const { sbtContract } = await this.masa.contracts.asbt.connect<Contract>(
      address,
      factory
    );

    return this.attach(sbtContract);
  };
}
