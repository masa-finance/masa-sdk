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

  let readerAddress;
  try {
    readerAddress = await masa.contracts.identity.SoulboundIdentityContract[
      "ownerOf(uint256)"
    ](readerIdentityId);

    if (!readerAddress) {
      result.message = `No Identity address found for Identity ${readerIdentityId}`;
      return result;
    }
  } catch {
    //
  }

  let ownerAddress;
  const { identityId: ownerIdentityId } = await masa.identity.load(
    (ownerAddress = await contract.ownerOf(tokenId))
  );

  if (!ownerIdentityId) {
    console.error("Owner identity not found");
    return result;
  }

  console.log(
    `Verifying link for '${await contract.name()}' (${
      contract.address
    }) ID: ${tokenId.toString()}`
  );
  console.log(`from Identity ${ownerIdentityId.toString()} (${ownerAddress})`);
  console.log(
    `to Identity ${readerIdentityId.toString()} (${readerAddress})\n`
  );

  const links = (await loadLinks(masa, contract, tokenId)).filter(
    (link) => link.exists && !link.isRevoked
  );

  result.verified = false;
  for (const link of links) {
    try {
      result.verified =
        await masa.contracts.identity.SoulLinkerContract.validateLink(
          readerIdentityId,
          ownerIdentityId,
          contract.address,
          tokenId,
          link.signatureDate
        );

      if (result.verified) {
        result.message = "";
        result.success = true;
        break;
      }
    } catch (err: any) {
      // ignore
    }
  }

  console.log({ validateLinkResult: result });

  return result;
};
