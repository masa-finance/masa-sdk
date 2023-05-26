import Masa from "../../masa";
import { MasaSBTSelfSovereign } from "@masa-finance/masa-contracts-identity";

export const addAuthority = async (
  masa: Masa,
  contract: MasaSBTSelfSovereign,
  authorityAddress: string
) => {
  await contract.addAuthority(authorityAddress);
};
