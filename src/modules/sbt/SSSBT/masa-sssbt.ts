import type { ReferenceSBTSelfSovereign } from "@masa-finance/masa-contracts-identity";
import { ReferenceSBTSelfSovereign__factory } from "@masa-finance/masa-contracts-identity";

import type { ContractFactory } from "../../../interface/contract-factory";
import { MasaBase } from "../../../masa-base";
import { deploySSSBT } from "./deploy";
import { MasaSSSBTWrapper } from "./masa-sssbt-wrapper";

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

  /**
   *
   * @param contract
   */
  public attach = <Contract extends ReferenceSBTSelfSovereign>(
    contract: Contract,
  ): MasaSSSBTWrapper<Contract> => {
    return new MasaSSSBTWrapper<Contract>(this.masa, contract);
  };

  /**
   *
   * @param address
   * @param factory
   */
  public connect = async <Contract extends ReferenceSBTSelfSovereign>(
    address: string,
    factory: ContractFactory = ReferenceSBTSelfSovereign__factory,
  ): Promise<MasaSSSBTWrapper<Contract>> => {
    const { contract } = await this.masa.contracts.sssbt.connect<Contract>(
      address,
      factory,
    );

    return this.attach<Contract>(contract);
  };
}
