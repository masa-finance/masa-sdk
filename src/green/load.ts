import { BigNumber, constants } from "ethers";
import Masa from "../masa";
import { patchMetadataUrl } from "../helpers";
import { GreenDetails, IGreen } from "../interface";

export const loadGreenDetails = async (
  masa: Masa,
  greenIds: BigNumber[]
): Promise<GreenDetails[]> => {
  return (
    await Promise.all(
      greenIds.map(async (tokenId: BigNumber) => {
        const tokenUri = patchMetadataUrl(
          masa,
          await masa.contracts.instances.SoulboundGreenContract.tokenURI(
            tokenId
          )
        );

        if (masa.config.verbose) {
          console.info(`Green Metadata URL: '${tokenUri}'`);
        }

        const metadata = <IGreen | undefined>(
          await masa.client.metadata.get(tokenUri)
        );

        return {
          tokenId,
          tokenUri,
          metadata,
        };
      })
    )
  ).filter((green: GreenDetails) => !!green.metadata);
};

export const loadGreensByIdentityId = async (
  masa: Masa,
  identityId: BigNumber
): Promise<GreenDetails[]> => {
  const greenIds: BigNumber[] =
    await masa.contracts.instances.SoulLinkerContract[
      "getSBTConnections(uint256,address)"
    ](identityId, masa.contracts.instances.SoulboundGreenContract.address);

  return await loadGreenDetails(masa, greenIds);
};

export const loadGreensByAddress = async (
  masa: Masa,
  address: string
): Promise<GreenDetails[]> => {
  let greenIds: BigNumber[] = [];

  try {
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
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Loading green failed! ${error.message}`);
    }
  }

  return await loadGreenDetails(masa, greenIds);
};
