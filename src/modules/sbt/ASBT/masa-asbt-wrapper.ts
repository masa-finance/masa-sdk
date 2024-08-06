import type { ReferenceSBTAuthority } from "@masa-finance/masa-contracts-identity";

import { MasaSBTWrapper } from "../SBT/masa-sbt-wrapper";

export class MasaASBTWrapper<
  Contract extends ReferenceSBTAuthority,
> extends MasaSBTWrapper<Contract> {}
