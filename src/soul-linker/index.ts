import Masa from "../masa";
import { createLink } from "./create-link";
import { PaymentMethod } from "../contracts";
import { establishLinkFromPassport } from "./establish-link";
import { BigNumber, Contract } from "ethers";
import { verifyLink } from "./verify-link";
import { listLinks } from "./list-links";
import { breakLink } from "./break-link";
import { queryLinkFromPassport } from "./query-link";
import { MasaBase } from "../helpers/masa-base";

export * from "./create-link";
export * from "./establish-link";
export * from "./verify-link";
export * from "./list-links";

export class MasaSoulLinker extends MasaBase {
  constructor(masa: Masa, private contract: Contract) {
    super(masa);
  }

  create = (tokenId: BigNumber, readerIdentityId: BigNumber) =>
    createLink(this.masa, this.contract, tokenId, readerIdentityId);
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
  query = (passport: string, paymentMethod: PaymentMethod = "eth") =>
    queryLinkFromPassport(this.masa, this.contract, passport, paymentMethod);
}
