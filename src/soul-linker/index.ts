import Masa from "../masa";
import { createLink } from "./create-link";
import { PaymentMethod } from "../contracts";
import { establishLinkFromPassport } from "./establish-link";
import { BigNumber, Contract } from "ethers";
import { verifyLink } from "./verify-link";
import { listLinks } from "./list-links";
import { breakLink } from "./break-link";

export * from "./create-link";
export * from "./establish-link";
export * from "./verify-link";
export * from "./list-links";

export class MasaSoulLinker {
  constructor(private masa: Masa, private contract: Contract) {}

  create = (tokenId: BigNumber, receiverIdentityId: BigNumber) =>
    createLink(this.masa, this.contract, tokenId, receiverIdentityId);
  establish = (passport: string, paymentMethod: PaymentMethod = "eth") =>
    establishLinkFromPassport(
      this.masa,
      this.contract,
      passport,
      paymentMethod
    );
  verify = (tokenId: BigNumber, readerIdentityId?: BigNumber) =>
    verifyLink(this.masa, this.contract, tokenId, readerIdentityId);
  list = (tokenId: BigNumber) => listLinks(this.masa, this.contract, tokenId);
  break = (tokenId: BigNumber, readerIdentityId: BigNumber) =>
    breakLink(this.masa, this.contract, tokenId, readerIdentityId);
}
