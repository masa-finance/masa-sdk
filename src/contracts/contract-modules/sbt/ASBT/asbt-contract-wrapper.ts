import { ReferenceSBTAuthority } from "@masa-finance/masa-contracts-identity";

import { SBTContractWrapper } from "../SBT/sbt-contract-wrapper";

export class ASBTContractWrapper<
  Contract extends ReferenceSBTAuthority,
> extends SBTContractWrapper<Contract> {}
