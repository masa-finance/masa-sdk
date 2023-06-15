import {
  ReferenceSBTSelfSovereign,
  ReferenceSBTSelfSovereign__factory,
} from "@masa-finance/masa-contracts-identity";

import { MasaBase } from "../../../base";
import { ContractFactory } from "../../../contracts";
import { deploySSSBT } from "./deploy";
import { SSSBTWrapper } from "./sssbt-wrapper";

export class MasaSSSBT extends MasaBase {
  /**
   *
   * @param name
   * @param symbol
   * @param baseTokenUri
   * @param authorityAddress
   * @param limit
   * @param adminAddress
   */
  deploy = ({
    name,
    symbol,
    baseTokenUri,
    limit = 1,
    authorityAddress,
    adminAddress,
  }: {
    name: string;
    symbol: string;
    baseTokenUri: string;
    limit?: number;
    authorityAddress: string;
    adminAddress?: string;
  }) =>
    deploySSSBT({
      masa: this.masa,
      name,
      symbol,
      baseTokenUri,
      limit,
      authorityAddress,
      adminAddress,
    });

  public attach = <Contract extends ReferenceSBTSelfSovereign>(
    sbtContract: Contract
  ) => {
    return new SSSBTWrapper<Contract>(this.masa, sbtContract);
  };
  /**
   *
   * @param address
   * @param factory
   */
  public connect = async <Contract extends ReferenceSBTSelfSovereign>(
    address: string,
    factory: ContractFactory = ReferenceSBTSelfSovereign__factory
  ): Promise<SSSBTWrapper<Contract>> => {
    const { sbtContract } = await this.masa.contracts.sssbt.connect<Contract>(
      address,
      factory
    );

    return this.attach<Contract>(sbtContract);
  };
}
