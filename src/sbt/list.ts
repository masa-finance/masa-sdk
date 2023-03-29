import { BigNumber } from "ethers";
import {
  MasaSBTAuthority,
  MasaSBTSelfSovereign,
} from "@masa-finance/masa-contracts-identity";
import Masa from "../masa";
import { loadSBTsByAddress } from "./load";

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

  const sbts = await loadSBTsByAddress(masa, contract, address);

  if (sbts.length === 0) {
    console.log(
      `No SBTs found on contract '${await contract.name()}' (${
        contract.address
      })`
    );
  }

  let i = 1;
  for (const sbt of sbts) {
    console.log(`Token: ${i}`);
    console.log(`Token ID: ${sbt.tokenId}`);
    console.log(`Metadata: ${sbt.tokenUri}`);

    i++;
  }

  return sbts;
};
