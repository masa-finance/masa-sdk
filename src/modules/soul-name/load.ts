import type { BigNumber } from "ethers";

import type {
  ISoulName,
  MasaInterface,
  SoulNameDetails,
} from "../../interface";
import { isBigNumber } from "../../utils";

export const loadSoulNameByTokenId = async (
  masa: MasaInterface,
  tokenId: string | BigNumber,
): Promise<SoulNameDetails | undefined> => {
  let result;

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
      tokenUri.replace("ar://", "").replace("https://arweave.net/", ""),
    )) as ISoulName;

    result = {
      owner,
      tokenUri,
      tokenDetails: { ...tokenDetails, extension },
      metadata,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(
        `Failed to load Soul Name with TokenID ${tokenId.toString()}`,
        error.message,
      );
    }
  }

  return result;
};

export const loadSoulNameByName = async (
  masa: MasaInterface,
  soulName: string,
): Promise<SoulNameDetails | undefined> => {
  let result;

  try {
    const tokenId =
      await masa.contracts.instances.SoulNameContract.getTokenId(soulName);

    result = await loadSoulNameByTokenId(masa, tokenId);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Failed to load Soul Name '${soulName}'`, error.message);
    }
  }

  return result;
};

export const loadSoulNamesByNames = async (
  masa: MasaInterface,
  soulNames: string[],
): Promise<SoulNameDetails[]> => {
  return (
    await Promise.all(
      soulNames.map((soulName: string) => loadSoulNameByName(masa, soulName)),
    )
  ).filter((soulName: SoulNameDetails | undefined) =>
    Boolean(soulName),
  ) as SoulNameDetails[];
};

/**
 * loads active soul names
 *
 * @param masa
 * @param identityIdOrAddress
 */
export const loadSoulNames = async (
  masa: MasaInterface,
  identityIdOrAddress: BigNumber | string,
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

/**
 * loads all soul names even expired ones
 *
 * @param masa
 * @param identityIdOrAddress
 */
export const loadSoulNamesWithExpired = async (
  masa: MasaInterface,
  identityIdOrAddress: BigNumber | string,
): Promise<string[]> => {
  let soulNames: string[] = [];

  try {
    const { "ownerOf(uint256)": ownerOfIdentity } =
      masa.contracts.instances.SoulboundIdentityContract;

    const address = isBigNumber(identityIdOrAddress)
      ? await ownerOfIdentity(identityIdOrAddress)
      : identityIdOrAddress;

    const { balanceOf, tokenOfOwnerByIndex, tokenData } =
      masa.contracts.instances.SoulNameContract;

    const [loadedSoulnames, balance] = await Promise.all([
      loadSoulNames(masa, address),
      balanceOf(address),
    ]);

    soulNames = loadedSoulnames;

    // getSoulNames does not return expired soul names, this means if we encounter such a name
    // we might load it in a different way
    if (balance.toNumber() !== soulNames.length) {
      for (let i = 0; i < balance.toNumber(); i++) {
        const soulnameTokenId = await tokenOfOwnerByIndex(address, i);
        const { name } = await tokenData(soulnameTokenId);

        if (soulNames.indexOf(name) === -1) {
          soulNames = [...soulNames, name];
        }
      }
    }
  } catch {
    // ignore
  }

  return soulNames;
};

export const loadSoulNameDetailsByAddress = async (
  masa: MasaInterface,
  address: string,
) => {
  return await loadSoulNamesByNames(masa, await loadSoulNames(masa, address));
};
