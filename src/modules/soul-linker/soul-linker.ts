import { ILinkableSBT } from "@masa-finance/masa-contracts-identity";
import type { BigNumber } from "ethers";

import { BreakLinkResult } from "../../contracts";
import type { MasaInterface, PaymentMethod } from "../../interface";
import { BaseResult } from "../../interface";
import { MasaBase } from "../../masa-base";
import { createLink, CreateLinkResult } from "./create-link";
import { establishLinkFromPassport } from "./establish-link";
import { listLinks, ListLinksResult } from "./list-links";
import { queryLinkFromPassport } from "./query-link";
import { verifyLink, VerifyLinkResult } from "./verify-link";

export class MasaSoulLinker extends MasaBase {
  constructor(
    masa: MasaInterface,
    private contract: ILinkableSBT,
  ) {
    super(masa);
  }

  create = (
    tokenId: BigNumber,
    readerIdentityId: BigNumber,
  ): Promise<CreateLinkResult> =>
    createLink(this.masa, this.contract, tokenId, readerIdentityId);
  establish = (
    paymentMethod: PaymentMethod = "ETH",
    passport: string,
  ): Promise<BaseResult> =>
    establishLinkFromPassport(
      this.masa,
      paymentMethod,
      this.contract,
      passport,
    );
  verify = (
    tokenId: BigNumber,
    readerIdentityId?: BigNumber,
  ): Promise<VerifyLinkResult> =>
    verifyLink(this.masa, this.contract, tokenId, readerIdentityId);
  list = (tokenId: BigNumber): Promise<ListLinksResult> =>
    listLinks(this.masa, this.contract, tokenId);
  break = (
    tokenId: BigNumber,
    readerIdentityId: BigNumber,
  ): Promise<BreakLinkResult> =>
    this.masa.contracts.soulLinker.breakLink(
      this.contract,
      tokenId,
      readerIdentityId,
    );
  query = (
    paymentMethod: PaymentMethod,
    passport: string,
  ): Promise<BaseResult> =>
    queryLinkFromPassport(this.masa, paymentMethod, this.contract, passport);
}
