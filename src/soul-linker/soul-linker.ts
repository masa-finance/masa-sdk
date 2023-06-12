import { BigNumber, Contract } from "ethers";

import type { MasaInterface, PaymentMethod } from "../interface";
import { MasaBase } from "../interface";
import { createLink } from "./create-link";
import { establishLinkFromPassport } from "./establish-link";
import { listLinks } from "./list-links";
import { queryLinkFromPassport } from "./query-link";
import { verifyLink } from "./verify-link";

export class MasaSoulLinker extends MasaBase {
  constructor(masa: MasaInterface, private contract: Contract) {
    super(masa);
  }

  create = (tokenId: BigNumber, readerIdentityId: BigNumber) =>
    createLink(this.masa, this.contract, tokenId, readerIdentityId);
  establish = (paymentMethod: PaymentMethod = "ETH", passport: string) =>
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
    this.masa.contracts.soulLinker.breakLink(
      this.contract,
      tokenId,
      readerIdentityId
    );
  query = (paymentMethod: PaymentMethod, passport: string) =>
    queryLinkFromPassport(this.masa, paymentMethod, this.contract, passport);
}
