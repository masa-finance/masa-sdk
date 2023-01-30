import { createCreditScore } from "./create";
import { burnCreditScore } from "./burn";
import { listCreditScores, loadCreditScoreByTokenId } from "./load";
import { BigNumber } from "ethers";
import Masa from "../masa";
import { MasaSoulLinker } from "../soul-linker";

export class MasaCreditScore {
  public readonly links: MasaSoulLinker;

  constructor(private masa: Masa) {
    this.links = new MasaSoulLinker(
      this.masa,
      this.masa.contracts.instances.SoulboundCreditScoreContract
    );
  }

  create = () => createCreditScore(this.masa);
  burn = (creditScoreId: BigNumber) =>
    burnCreditScore(this.masa, creditScoreId);
  list = (address?: string) => listCreditScores(this.masa, address);
  load = (creditScoreId: BigNumber) =>
    loadCreditScoreByTokenId(this.masa, creditScoreId);
}
