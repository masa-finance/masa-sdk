import { ReferenceSBTSelfSovereign } from "@masa-finance/masa-contracts-identity";
import type { TypedDataField } from "ethers";

import { SBTContractWrapper } from "../SBT/sbt-contract-wrapper";

export class SSSBTContractWrapper<
  Contract extends ReferenceSBTSelfSovereign,
> extends SBTContractWrapper<Contract> {
  /**
   *
   */
  public readonly types: Record<string, Array<TypedDataField>> = {
    Mint: [
      { name: "to", type: "address" },
      { name: "authorityAddress", type: "address" },
      { name: "signatureDate", type: "uint256" },
    ],
  };
}
