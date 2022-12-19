import Masa from "../masa";
import { createLink } from "./create-link";
import { PaymentMethod } from "../contracts";
import { establishLink } from "./establish-link";
import { BigNumber, Contract } from "ethers";
import { verifyLink } from "./verify-link";
import { listLinks } from "./list-links";

export * from "./create-link";
export * from "./establish-link";
export * from "./verify-link";
export * from "./list-links";

export class MasaSoulLinker {
  constructor(private masa: Masa, private sbtContract: Contract) {}

  create = (tokenId: BigNumber, receiverIdentityId: BigNumber) =>
    createLink(this.masa, this.sbtContract, tokenId, receiverIdentityId);
  establish = (
    tokenId: BigNumber,
    signature: string,
    signatureDate: number,
    expirationDate: number,
    paymentMethod: PaymentMethod = "eth"
  ) =>
    establishLink(
      this.masa,
      this.sbtContract,
      tokenId,
      signature,
      paymentMethod,
      signatureDate,
      expirationDate
    );
  verify = (tokenId: BigNumber, readerIdentityId: BigNumber) =>
    verifyLink(this.masa, this.sbtContract, tokenId, readerIdentityId);
  list = (tokenId: BigNumber, readerIdentityId: BigNumber) =>
    listLinks(this.masa, this.sbtContract, tokenId, readerIdentityId);
}
