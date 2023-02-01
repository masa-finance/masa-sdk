import { BigNumber, constants } from "ethers";
import Masa from "../masa";
import { IGreen } from "../interface";
import { patchMetadataUrl } from "../helpers";

export const loadGreenIds = async (masa: Masa, greenIds: BigNumber[]) => {
  return await Promise.all(
    greenIds.map(async (tokenId) => {
      const tokenUri = patchMetadataUrl(
        masa,
        await masa.contracts.instances.SoulboundGreenContract.tokenURI(tokenId)
      );

      const metadata = <IGreen | undefined>(
        await masa.metadata.retrieve(tokenUri)
      );

      return {
        tokenId,
        tokenUri,
        metadata,
      };
    })
  );
};

export const loadGreensByIdentityId = async (
  masa: Masa,
  identityId: BigNumber
): Promise<
  {
    tokenId: BigNumber;
    tokenUri: string;
    metadata?: IGreen;
  }[]
> => {
  const greenIds: BigNumber[] =
    await masa.contracts.instances.SoulLinkerContract[
      "getSBTConnections(uint256,address)"
    ](identityId, masa.contracts.instances.SoulboundGreenContract.address);

  return await loadGreenIds(masa, greenIds);
};

export const loadGreensByAddress = async (
  masa: Masa,
  address: string
): Promise<
  {
    tokenId: BigNumber;
    tokenUri: string;
    metadata?: IGreen;
  }[]
> => {
  let greenIds: BigNumber[] = [];
  // do we have a soul linker here? use it!
  if (
    masa.contracts.instances.SoulLinkerContract.address !==
    constants.AddressZero
  ) {
    greenIds = await masa.contracts.instances.SoulLinkerContract[
      "getSBTConnections(address,address)"
    ](address, masa.contracts.instances.SoulboundGreenContract.address);
  } else {
    const balance: number = (
      await masa.contracts.instances.SoulboundGreenContract.balanceOf(address)
    ).toNumber();

    if (balance > 0) {
      for (let i = 0; i < balance; i++) {
        greenIds.push(
          await masa.contracts.instances.SoulboundGreenContract.tokenOfOwnerByIndex(
            address,
            i
          )
        );
      }
    }
  }

  return await loadGreenIds(masa, greenIds);
};

export const listGreens = async (
  masa: Masa,
  address?: string
): Promise<
  {
    tokenId: BigNumber;
    tokenUri: string;
    metadata?: IGreen;
  }[]
> => {
  address = address || (await masa.config.wallet.getAddress());

  const greens = await loadGreensByAddress(masa, address);

  if (greens.length === 0) console.log("No Masa Green found");

  let i = 1;
  for (const green of greens) {
    console.log(`Token: ${i}`);
    console.log(`Token ID: ${green.tokenId}`);
    i++;
    if (green.metadata) {
      console.log(`Metadata: ${JSON.stringify(green.metadata, null, 2)}`);
    }
  }

  return greens;
};
