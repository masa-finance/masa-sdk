import Masa from "../masa";
import { BaseResult } from "../interface";
import { BigNumber, Contract } from "ethers";

export type VerifyLinkResult = BaseResult;

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

  await masa.contracts.identity.SoulLinkerContract.validateLink(
    identityId,
    ownerIdentityId,
    contract.address,
    tokenId,
    BigNumber.from(1)
  );

  return result;
};
