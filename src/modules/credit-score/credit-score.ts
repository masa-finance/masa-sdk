import type { SoulboundCreditScore } from "@masa-finance/masa-contracts-identity";
import type { BigNumber } from "ethers";

import type { MasaInterface } from "../../interface";
import { MasaLinkable } from "../masa-linkable";
import { listCreditScores } from "./list";
import { loadCreditScores } from "./load";

export class MasaCreditScore extends MasaLinkable<SoulboundCreditScore> {
  constructor(masa: MasaInterface) {
    super(masa, masa.contracts.instances.SoulboundCreditScoreContract);
  }

  burn = (creditScoreId: BigNumber) =>
    this.masa.contracts.creditScore.burn(creditScoreId);
  list = (address?: string) => listCreditScores(this.masa, address);
  load = (identityIdOrAddress: BigNumber | string) =>
    loadCreditScores(this.masa, identityIdOrAddress);
}
