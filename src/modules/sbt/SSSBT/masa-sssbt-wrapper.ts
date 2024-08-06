import type { ReferenceSBTSelfSovereign } from "@masa-finance/masa-contracts-identity";

import { MasaSBTWrapper } from "../SBT/masa-sbt-wrapper";

export class MasaSSSBTWrapper<
  Contract extends ReferenceSBTSelfSovereign,
> extends MasaSBTWrapper<Contract> {}
