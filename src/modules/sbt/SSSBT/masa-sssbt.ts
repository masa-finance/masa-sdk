import type { ReferenceSBTSelfSovereign } from "@masa-finance/masa-contracts-identity";
import { ReferenceSBTSelfSovereign__factory } from "@masa-finance/masa-contracts-identity";
import { PaymentGateway } from "@masa-finance/masa-contracts-identity/dist/typechain/contracts/SoulStore";

import type { DeployResult } from "../../../interface";
import type { ContractFactory } from "../../../interface/contract-factory";
import { MasaBase } from "../../../masa-base";
import { deploySSSBT } from "./deploy";
import { MasaSSSBTWrapper } from "./masa-sssbt-wrapper";
import PaymentParamsStruct = PaymentGateway.PaymentParamsStruct;

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
  public deploy = ({
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
  }): Promise<DeployResult<PaymentParamsStruct> | undefined> =>
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
