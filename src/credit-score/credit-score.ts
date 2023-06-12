import { SoulboundCreditScore } from "@masa-finance/masa-contracts-identity";
import { BigNumber } from "ethers";

import { PaymentMethod } from "../interface";
import { MasaInterface } from "../interface/masa-interface";
import { MasaLinkable } from "../interface/masa-linkable";
import { createCreditScore } from "./create";
import { listCreditScores } from "./list";
import { loadCreditScores } from "./load";

export class MasaCreditScore extends MasaLinkable<SoulboundCreditScore> {
  constructor(masa: MasaInterface) {
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
