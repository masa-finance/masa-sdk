import { BigNumber } from "ethers";
import {
  MasaSBTAuthority,
  MasaSBTSelfSovereign,
} from "@masa-finance/masa-contracts-identity";
import Masa from "../masa";
import { loadSBTs } from "./load";

export const listSBTs = async (
  masa: Masa,
  contract: MasaSBTSelfSovereign | MasaSBTAuthority,
  address?: string
): Promise<
  {
    tokenId: BigNumber;
    tokenUri: string;
  }[]
> => {
  address = address || (await masa.config.wallet.getAddress());

  const SBTs = await loadSBTs(masa, contract, address);

  if (SBTs.length === 0) {
    console.log(
      `No SBTs found on contract '${await contract.name()}' (${
        contract.address
      })`
    );
  }

  let i = 1;
  for (const SBT of SBTs) {
    console.log(`Token: ${i}`);
    console.log(`Token ID: ${SBT.tokenId}`);
    console.log(`Metadata: ${SBT.tokenUri}`);

    i++;
  }

  return SBTs;
};
