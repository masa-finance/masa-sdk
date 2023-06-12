import type { ReferenceSBTSelfSovereign } from "@masa-finance/masa-contracts-identity";
import { ReferenceSBTSelfSovereign__factory } from "@masa-finance/masa-contracts-identity";

import { MasaSBTs, SBTWrapper } from "../sbt";
import { addAuthority } from "./add-authority";
import { deploySSSBT } from "./deploy";
import { mintSSSBT } from "./mint";
import { signSSSBT } from "./sign";

export class SSSBTWrapper extends SBTWrapper<ReferenceSBTSelfSovereign> {
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

  /**
   *
   * @param authorityAddress
   */
  addAuthority = (authorityAddress: string) =>
    addAuthority(this.masa, this.contract, authorityAddress);
}

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
  public connect = async (address: string): Promise<SSSBTWrapper> => {
    const { sbtContract } = await this.masa.contracts.sssbt.connect(
      address,
      ReferenceSBTSelfSovereign__factory
    );

    return new SSSBTWrapper(this.masa, sbtContract);
  };
}
