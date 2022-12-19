import { createCreditScore } from "./create";
import { burnCreditScore } from "./burn";
import { listCreditScores, loadCreditScoresByIdentityId } from "./list";
import { BigNumber } from "ethers";
import Masa from "../masa";
import { MasaSoulLinker } from "../soul-linker";

export class MasaCreditScore {
  public readonly links: MasaSoulLinker;

  constructor(private masa: Masa) {
    this.links = new MasaSoulLinker(
      this.masa,
      this.masa.contracts.identity.SoulboundCreditScoreContract
    );
  }

  mint = (address: string, signature: string) =>
    this.masa.client.creditScoreMint(address, signature);
  create = () => createCreditScore(this.masa);
  burn = (creditScoreId: BigNumber) =>
    burnCreditScore(this.masa, creditScoreId);
  list = (address?: string) => listCreditScores(this.masa, address);
  load = (identityId: BigNumber) =>
    loadCreditScoresByIdentityId(this.masa, identityId);
}
