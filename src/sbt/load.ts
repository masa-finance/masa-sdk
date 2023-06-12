import type {
  MasaSBT,
  MasaSBTAuthority,
  MasaSBTSelfSovereign,
} from "@masa-finance/masa-contracts-identity";
import { BigNumber } from "ethers";

import { patchMetadataUrl } from "../helpers";
import type { MasaInterface } from "../interface";
import { isBigNumber } from "../utils";

export const loadSBTIDs = async (
  masa: MasaInterface,
  contract: MasaSBTSelfSovereign | MasaSBTAuthority | MasaSBT,
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

export const loadSBTs = async (
  masa: MasaInterface,
  contract: MasaSBTSelfSovereign | MasaSBTAuthority | MasaSBT,
  identityIdOrAddress: BigNumber | string
): Promise<
  {
    tokenId: BigNumber;
    tokenUri: string;
  }[]
> => {
  let SBTIDs: BigNumber[] = [];

  try {
    // do we have a soul linker here? use it!
    if (masa.contracts.instances.SoulLinkerContract.hasAddress) {
      const {
        "getSBTConnections(address,address)": getSBTConnectionsByAddress,
        "getSBTConnections(uint256,address)": getSBTConnectionsByIdentity,
      } = masa.contracts.instances.SoulLinkerContract;

      SBTIDs = await (isBigNumber(identityIdOrAddress)
        ? getSBTConnectionsByIdentity(identityIdOrAddress, contract.address)
        : getSBTConnectionsByAddress(identityIdOrAddress, contract.address));
    }
    // no soul linker, lets try by identity or address
    else {
      let identityAddress: string;

      if (isBigNumber(identityIdOrAddress)) {
        identityAddress =
          await masa.contracts.instances.SoulboundIdentityContract[
            "ownerOf(uint256)"
          ](identityIdOrAddress);
      } else {
        identityAddress = identityIdOrAddress as string;
      }

      const balance: number = (
        await contract.balanceOf(identityAddress)
      ).toNumber();

      if (balance > 0) {
        for (let i = 0; i < balance; i++) {
          SBTIDs.push(await contract.tokenOfOwnerByIndex(identityAddress, i));
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
