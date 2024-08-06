import type { MasaDynamicSSSBT } from "@masa-finance/masa-contracts-identity";

import { MasaDynamicSBTWrapper } from "../masa-dynamic-sbt-wrapper";

export class MasaDynamicSSSBTWrapper<
  Contract extends MasaDynamicSSSBT,
> extends MasaDynamicSBTWrapper<Contract> {}
