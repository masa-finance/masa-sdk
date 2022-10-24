import { BigNumber } from "ethers";
import Masa from "../masa";

export const loadSoulNamesFromIdentity = async (
  masa: Masa,
  identityId: BigNumber
) => {
  const soulNameDetails = [];

  const identityContracts = await masa.contracts.loadIdentityContracts();

  const soulNames = await identityContracts.SoulNameContract[
    "getSoulNames(uint256)"
  ](identityId);

  // todo parallelize this
  for (const nameIndex in soulNames) {
    const tokenDetails = await identityContracts.SoulNameContract.getTokenData(
      soulNames[nameIndex]
    );

    const tokenUri = await identityContracts.SoulNameContract[
      "tokenURI(uint256)"
    ](tokenDetails.tokenId);

    let metadata;
    try {
      const metadataResponse = await masa.arweaveClient.transactions
        .getData(tokenUri.replace("ar://", ""), {
          decode: true,
          string: true,
        })
        .catch(() => {
          // ignore
        });

      metadata = JSON.parse(metadataResponse as string);
    } catch {
      // ignore
    }

    soulNameDetails.push({
      index: nameIndex,
      tokenUri,
      tokenDetails,
      metadata,
    });
  }

  return soulNameDetails;
};
