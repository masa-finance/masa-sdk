import { BigNumber } from "ethers";
import Masa from "../masa";
import { ISoulName, SoulNameDetails } from "../interface";
import { isBigNumber } from "../utils";

export const loadSoulNameByTokenId = async (
  masa: Masa,
  tokenId: string | BigNumber
): Promise<SoulNameDetails | undefined> => {
  try {
    const {
      getTokenData,
      tokenData,
      ownerOf,
      "tokenURI(uint256)": tokenURI,
      extension: getExtension,
    } = masa.contracts.instances.SoulNameContract;

    const [tokenDetails, owner, tokenUri, extension] = await Promise.all([
      getTokenData((await tokenData(tokenId)).name),
      ownerOf(tokenId),
      tokenURI(tokenId),
      getExtension(),
    ]);

    const metadata = (await masa.arweave.loadTransactionData(
      tokenUri.replace("ar://", "").replace("https://arweave.net/", "")
    )) as ISoulName;

    return {
      owner,
      tokenUri,
      tokenDetails: { ...tokenDetails, extension },
      metadata,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(
        `Failed to load Soul Name with TokenID ${tokenId.toString()}`,
        error.message
      );
    }
  }
};

export const loadSoulNameByName = async (
  masa: Masa,
  soulName: string
): Promise<SoulNameDetails | undefined> => {
  try {
    const tokenId = await masa.contracts.instances.SoulNameContract.getTokenId(
      soulName
    );

    return await loadSoulNameByTokenId(masa, tokenId);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Failed to load Soul Name '${soulName}'`, error.message);
    }
  }
};

export const loadSoulNamesByNames = async (
  masa: Masa,
  soulNames: string[]
): Promise<SoulNameDetails[]> => {
  return (
    await Promise.all(
      soulNames.map((soulName: string) => loadSoulNameByName(masa, soulName))
    )
  ).filter(
    (soulName: SoulNameDetails | undefined) => !!soulName
  ) as SoulNameDetails[];
};

export const loadSoulNames = async (
  masa: Masa,
  identityIdOrAddress: BigNumber | string
): Promise<string[]> => {
  let soulNames: string[] = [];

  try {
    const {
      "getSoulNames(address)": getSoulNamesByAddress,
      "getSoulNames(uint256)": getSoulNamesByIdentity,
    } = masa.contracts.instances.SoulNameContract;

    soulNames = await (isBigNumber(identityIdOrAddress)
      ? getSoulNamesByIdentity(identityIdOrAddress)
      : getSoulNamesByAddress(identityIdOrAddress));
  } catch {
    // ignore
  }

  return soulNames;
};

export const loadSoulNameDetailsByAddress = async (
  masa: Masa,
  address: string
) => {
  return await loadSoulNamesByNames(masa, await loadSoulNames(masa, address));
};
