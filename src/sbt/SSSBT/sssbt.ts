import {
  ReferenceSBTSelfSovereign,
  ReferenceSBTSelfSovereign__factory,
} from "@masa-finance/masa-contracts-identity";
import { deploySSSBT } from "./deploy";
import { signSSSBT } from "./sign";
import { mintSSSBT } from "./mint";
import { MasaSBT, SBTWrapper } from "../sbt";

export class SSSBTWrapper<
  Contract extends ReferenceSBTSelfSovereign
> extends SBTWrapper<Contract> {
  /**
   *
   * @param receiver
   */
  sign = async (receiver: string) => {
    return await signSSSBT(this.masa, this.contract, receiver);
  };

  /**
   *
   * @param authorityAddress
   * @param signatureDate
   * @param signature
   */
  mint = async (
    authorityAddress: string,
    signatureDate: number,
    signature: string
  ) => {
    return await mintSSSBT(
      this.masa,
      this.contract,
      authorityAddress,
      signatureDate,
      signature
    );
  };
}

export class MasaSSSBT<
  Contract extends ReferenceSBTSelfSovereign
> extends MasaSBT<Contract> {
  /**
   *
   * @param name
   * @param symbol
   * @param baseTokenUri
   * @param authorityAddress
   * @param limit
   * @param adminAddress
   */
  deploy = (
    name: string,
    symbol: string,
    baseTokenUri: string,
    limit: number = 1,
    authorityAddress: string,
    adminAddress?: string
  ) =>
    deploySSSBT(
      this.masa,
      name,
      symbol,
      baseTokenUri,
      limit,
      authorityAddress,
      adminAddress
    );

  public async connect(address: string) {
    const { contract } = await super.connect(
      address,
      ReferenceSBTSelfSovereign__factory
    );

    return new SSSBTWrapper<Contract>(this.masa, contract);
  }
}
