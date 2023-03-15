import { BigNumber, constants } from "ethers";
import Masa from "../masa";
import { patchMetadataUrl } from "../helpers";
import { MasaSBTSelfSovereign } from "@masa-finance/masa-contracts-identity";

export const loadSBTIDs = async (
  masa: Masa,
  contract: MasaSBTSelfSovereign,
  sbtIDs: BigNumber[]
) => {
  return await Promise.all(
    sbtIDs.map(async (tokenId: BigNumber) => {
      const tokenUri = patchMetadataUrl(masa, await contract.tokenURI(tokenId));

      return {
        tokenId,
        tokenUri,
      };
    })
  );
};

export const loadSBTsByIdentityId = async (
  masa: Masa,
  contract: MasaSBTSelfSovereign,
  identityId: BigNumber
): Promise<
  {
    tokenId: BigNumber;
    tokenUri: string;
  }[]
> => {
  const SBTIds: BigNumber[] = await masa.contracts.instances.SoulLinkerContract[
    "getSBTConnections(uint256,address)"
  ](identityId, contract.address);

  return await loadSBTIDs(masa, contract, SBTIds);
};

export const loadSBTsByAddress = async (
  masa: Masa,
  contract: MasaSBTSelfSovereign,
  address: string
): Promise<
  {
    tokenId: BigNumber;
    tokenUri: string;
  }[]
> => {
  let SBTIDs: BigNumber[] = [];

  try {
    // do we have a soul linker here? use it!
    if (
      masa.contracts.instances.SoulLinkerContract.address !==
      constants.AddressZero
    ) {
      SBTIDs = await masa.contracts.instances.SoulLinkerContract[
        "getSBTConnections(address,address)"
      ](address, contract.address);
    } else {
      const balance: number = (await contract.balanceOf(address)).toNumber();

      if (balance > 0) {
        for (let i = 0; i < balance; i++) {
          SBTIDs.push(await contract.tokenOfOwnerByIndex(address, i));
        }
      }
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Loading SBTs failed! ${error.message}`);
    }
  }

  return await loadSBTIDs(masa, contract, SBTIDs);
};

export const listSBTs = async (
  masa: Masa,
  contract: MasaSBTSelfSovereign,
  address?: string
): Promise<
  {
    tokenId: BigNumber;
    tokenUri: string;
  }[]
> => {
  address = address || (await masa.config.wallet.getAddress());

  const sbts = await loadSBTsByAddress(masa, contract, address);

  if (sbts.length === 0) console.log("No SBTs found");

  let i = 1;
  for (const sbt of sbts) {
    console.log(`Token: ${i}`);
    console.log(`Token ID: ${sbt.tokenId}`);
    console.log(`Metadata: ${sbt.tokenUri}`);

    i++;
  }

  return sbts;
};
