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

export class MasaSoulLinker extends MasaBase {
  constructor(masa: Masa, private contract: Contract) {
    super(masa);
  }

  create = (tokenId: BigNumber, readerIdentityId: BigNumber) =>
    createLink(this.masa, this.contract, tokenId, readerIdentityId);
  establish = (paymentMethod: PaymentMethod = "eth", passport: string) =>
    establishLinkFromPassport(
      this.masa,
      paymentMethod,
      this.contract,
      passport
    );
  verify = (tokenId: BigNumber, readerIdentityId?: BigNumber) =>
    verifyLink(this.masa, this.contract, tokenId, readerIdentityId);
  list = (tokenId: BigNumber) => listLinks(this.masa, this.contract, tokenId);
  break = (tokenId: BigNumber, readerIdentityId: BigNumber) =>
    breakLink(this.masa, this.contract, tokenId, readerIdentityId);
  query = (paymentMethod: PaymentMethod, passport: string) =>
    queryLinkFromPassport(this.masa, paymentMethod, this.contract, passport);
}
