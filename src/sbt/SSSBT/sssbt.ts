import {
  ReferenceSBTSelfSovereign,
  ReferenceSBTSelfSovereign__factory,
} from "@masa-finance/masa-contracts-identity";
import { deploySSSBT } from "./deploy";
import { signSSSBT } from "./sign";
import { mintSSSBT } from "./mint";
import { MasaSBT, SBTWrapper } from "../sbt";
import Masa from "../../masa";

export class SSSBTWrapper<
  Contract extends ReferenceSBTSelfSovereign
> extends SBTWrapper<Contract> {
  /**
   *
   * @param receiver
   */
  sign = (receiver: string) => signSSSBT(this.masa, this.contract, receiver);

  /**
   *
   * @param authorityAddress
   * @param signatureDate
   * @param signature
   */
  mint = (authorityAddress: string, signatureDate: number, signature: string) =>
    mintSSSBT(
      this.masa,
      this.contract,
      authorityAddress,
      signatureDate,
      signature
    );
}

export class MasaSSSBT<
  Contract extends ReferenceSBTSelfSovereign
> extends MasaSBT<Contract> {
  constructor(masa: Masa) {
    super(masa);

    this.connect.bind(this);
  }

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

  /**
   *
   * @param address
   */
  public async connect(address: string) {
    const { contract } = await super.connect(
      address,
      ReferenceSBTSelfSovereign__factory
    );

    return new SSSBTWrapper<Contract>(this.masa, contract);
  }
}
