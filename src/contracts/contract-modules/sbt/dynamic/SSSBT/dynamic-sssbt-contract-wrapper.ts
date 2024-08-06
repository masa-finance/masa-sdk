import { MasaDynamicSSSBT } from "@masa-finance/masa-contracts-identity";
import type { TypedDataField } from "ethers";

import { DynamicSBTContractWrapper } from "../dynamic-sbt-contract-wrapper";

export class DynamicSSSBTContractWrapper<
  Contract extends MasaDynamicSSSBT,
> extends DynamicSBTContractWrapper<Contract> {
  /**
   *
   */
  public readonly types: Record<string, Array<TypedDataField>> = {
    SetState: [
      { name: "account", type: "address" },
      { name: "state", type: "string" },
      { name: "value", type: "bool" },
      { name: "authorityAddress", type: "address" },
      { name: "signatureDate", type: "uint256" },
    ],
  };
}
