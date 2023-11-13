import { MasaSBTDynamic } from "@masa-finance/masa-contracts-identity";

import { SBTContractWrapper } from "../SBT";

export class DynamicSBTContractWrapper<
  Contract extends MasaSBTDynamic,
> extends SBTContractWrapper<Contract> {}
