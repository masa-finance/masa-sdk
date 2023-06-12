import { MasaSBTSelfSovereign } from "@masa-finance/masa-contracts-identity";

import { MasaInterface } from "../../interface/masa-interface";

export const addAuthority = async (
  masa: MasaInterface,
  contract: MasaSBTSelfSovereign,
  authorityAddress: string
) => {
  await contract.addAuthority(authorityAddress);
};
