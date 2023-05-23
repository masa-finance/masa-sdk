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
  async sign(receiver: string) {
    return await signSSSBT(this.masa, this.sbtContract, receiver);
  }

  /**
   *
   * @param authorityAddress
   * @param signatureDate
   * @param signature
   */
  async mint(
    authorityAddress: string,
    signatureDate: number,
    signature: string
  ) {
    return await mintSSSBT(
      this.masa,
      this.sbtContract,
      authorityAddress,
      signatureDate,
      signature
    );
  }
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
   * @param adminAddress
   */
  deploy = (
    name: string,
    symbol: string,
    baseTokenUri: string,
    authorityAddress: string,
    adminAddress?: string
  ) =>
    deploySSSBT(
      this.masa,
      name,
      symbol,
      baseTokenUri,
      authorityAddress,
      adminAddress
    );

  public async connect(address: string) {
    const wrapper = await super.connect(
      address,
      ReferenceSBTSelfSovereign__factory
    );

    return new SSSBTWrapper<Contract>(this.masa, wrapper.sbtContract);
  }
}
