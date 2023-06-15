import { ReferenceSBTSelfSovereign__factory } from "@masa-finance/masa-contracts-identity";

import { ContractFactory } from "../../../contracts";
import { MasaSBTs } from "../SBT";
import { deploySSSBT } from "./deploy";
import { SSSBTWrapper } from "./sssbt-wrapper";

export class MasaSSSBT extends MasaSBTs {
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
   * @param address
   * @param factory
   */
  public connect = async (
    address: string,
    factory: ContractFactory = ReferenceSBTSelfSovereign__factory
  ): Promise<SSSBTWrapper> => {
    const { sbtContract } = await this.masa.contracts.sssbt.connect(
      address,
      factory
    );

    return new SSSBTWrapper(this.masa, sbtContract);
  };
}
