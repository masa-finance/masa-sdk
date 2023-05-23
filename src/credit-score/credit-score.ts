import { BigNumber } from "ethers";
import Masa from "../masa";
import { PaymentMethod } from "../interface";
import { createCreditScore, listCreditScores, loadCreditScores } from "./";
import { MasaLinkable } from "../helpers";
import { SoulboundCreditScore } from "@masa-finance/masa-contracts-identity";

export class MasaCreditScore extends MasaLinkable<SoulboundCreditScore> {
  constructor(masa: Masa) {
    super(masa, masa.contracts.instances.SoulboundCreditScoreContract);
  }

  create = (paymentMethod: PaymentMethod = "ETH") =>
    createCreditScore(this.masa, paymentMethod);
  burn = (creditScoreId: BigNumber) =>
    this.masa.contracts.creditScore.burn(creditScoreId);
  list = (address?: string) => listCreditScores(this.masa, address);
  load = (identityIdOrAddress: BigNumber | string) =>
    loadCreditScores(this.masa, identityIdOrAddress);
}
