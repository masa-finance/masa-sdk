import type { SoulboundCreditScore } from "@masa-finance/masa-contracts-identity";
import type { BigNumber } from "ethers";

import type {
  BaseResult,
  CreditScoreDetails,
  GenerateCreditScoreResult,
  MasaInterface,
  PaymentMethod,
} from "../../interface";
import { MasaLinkable } from "../masa-linkable";
import { createCreditScore } from "./create";
import { listCreditScores } from "./list";
import { loadCreditScores } from "./load";

export class MasaCreditScore extends MasaLinkable<SoulboundCreditScore> {
  public constructor(masa: MasaInterface) {
    super(masa, masa.contracts.instances.SoulboundCreditScoreContract);
  }

  public create = (
    paymentMethod: PaymentMethod = "ETH",
  ): Promise<GenerateCreditScoreResult> =>
    createCreditScore(this.masa, paymentMethod);
  public burn = (creditScoreId: BigNumber): Promise<BaseResult> =>
    this.masa.contracts.creditScore.burn(creditScoreId);
  public list = (address?: string): Promise<CreditScoreDetails[]> =>
    listCreditScores(this.masa, address);
  public load = (
    identityIdOrAddress: BigNumber | string,
  ): Promise<CreditScoreDetails[]> =>
    loadCreditScores(this.masa, identityIdOrAddress);
}
