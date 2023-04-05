import { BigNumber } from "ethers";
import Masa from "../masa";
import { MasaSoulLinker } from "../soul-linker";
import { MasaBase } from "../helpers/masa-base";
import { PaymentMethod } from "../interface";
import { createCreditScore, listCreditScores, loadCreditScores } from "./";

export class MasaCreditScore extends MasaBase {
  public readonly links: MasaSoulLinker;

  constructor(masa: Masa) {
    super(masa);

    this.links = new MasaSoulLinker(
      masa,
      this.masa.contracts.instances.SoulboundCreditScoreContract
    );
  }

  create = (paymentMethod: PaymentMethod = "ETH") =>
    createCreditScore(this.masa, paymentMethod);
  burn = (creditScoreId: BigNumber) =>
    this.masa.contracts.creditScore.burn(creditScoreId);
  list = (address?: string) => listCreditScores(this.masa, address);
  load = (identityIdOrAddress: BigNumber | string) =>
    loadCreditScores(this.masa, identityIdOrAddress);
}
