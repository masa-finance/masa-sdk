import Masa from "../masa";
import { BaseResult } from "../interface";
import { BigNumber, Contract } from "ethers";
import { loadLinks } from "./list-links";

export type VerifyLinkResult = BaseResult & { verified?: boolean };

export const verifyLink = async (
  masa: Masa,
  contract: Contract,
  tokenId: BigNumber,
  readerIdentityId: BigNumber
): Promise<VerifyLinkResult> => {
  const result: VerifyLinkResult = {
    success: false,
    message: "Unknown Error",
  };

  const { identityId, address } = await masa.identity.load();
  if (!identityId) {
    result.message = `No Identity found for address ${address}`;
    return result;
  }

  const { identityId: ownerIdentityId } = await masa.identity.load(
    await contract.ownerOf(tokenId)
  );

  if (!ownerIdentityId) {
    console.error("Owner identity not found");
    return result;
  }

  const links = await loadLinks(masa, contract, tokenId);

  for (const link of links) {
    await masa.contracts.identity.SoulLinkerContract.validateLink(
      readerIdentityId,
      ownerIdentityId,
      contract.address,
      tokenId,
      link.expirationDate
    );
  }

  return result;
};
