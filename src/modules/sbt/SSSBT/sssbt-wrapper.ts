import type { ReferenceSBTSelfSovereign } from "@masa-finance/masa-contracts-identity";

import { SBTWrapper } from "../SBT";
import { addAuthority } from "./add-authority";
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
