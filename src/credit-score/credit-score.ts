import { BigNumber } from "ethers";
import Masa from "../masa";
import { PaymentMethod } from "../interface";
import { createCreditScore, listCreditScores, loadCreditScores } from "./";
import { MasaLinkable } from "../helpers/masa-linkable";

export class MasaCreditScore extends MasaLinkable {
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
