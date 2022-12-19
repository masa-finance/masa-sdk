import Masa from "../masa";
import { BaseResult } from "../interface";
import { Contract } from "ethers";

export type BreakLinkResult = BaseResult;

export const breakLink = async (
  masa: Masa,
  contract: Contract,
  tokenId: number,
  readerIdentityId: number
): Promise<BreakLinkResult> => {
  const result: BreakLinkResult = {
    success: false,
    message: "Unknown Error",
  };

  const { identityId, address } = await masa.identity.load();
  if (!identityId) {
    result.message = `No Identity found for address ${address}`;
    return result;
  }

  if (!identityId) {
    console.error("Owner identity not found");
    return result;
  }

  const linkDates =
    await masa.contracts.identity.SoulLinkerContract.getPermissionSignatureDates(
      contract.address,
      tokenId,
      readerIdentityId
    );

  for (const linkDate of linkDates) {
    const linkData =
      await masa.contracts.identity.SoulLinkerContract.getPermissionInfo(
        contract.address,
        tokenId,
        readerIdentityId,
        linkDate
      );

    console.log(linkData);

    await masa.contracts.identity.SoulLinkerContract.revokePermission(
      readerIdentityId,
      identityId,
      contract.address,
      tokenId,
      linkDate
    );
  }

  return result;
};
