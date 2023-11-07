import type { MasaSBTDynamic } from "@masa-finance/masa-contracts-identity";

import { MasaSBTWrapper } from "../SBT";

export class MasaDynamicSBTWrapper<
  Contract extends MasaSBTDynamic,
> extends MasaSBTWrapper<Contract> {}
