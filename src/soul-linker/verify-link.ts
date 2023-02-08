import Masa from "../masa";
import { BaseResult } from "../interface";
import { BigNumber, Contract } from "ethers";
import { Link, loadLinks } from "./list-links";

export type VerifyLinkResult = BaseResult & { verified?: boolean };

export const verifyLink = async (
  masa: Masa,
  contract: Contract,
  tokenId: BigNumber,
  readerIdentityId?: BigNumber
): Promise<VerifyLinkResult> => {
  const result: VerifyLinkResult = {
    success: false,
    message: "Unknown Error",
  };

  const { identityId } = await masa.identity.load();
  if (!readerIdentityId && identityId) {
    readerIdentityId = identityId;
  }

  if (!readerIdentityId) {
    result.message = "Cant find reader identity";
    console.error(result.message);
    return result;
  }

  let readerAddress;
  try {
    readerAddress = await masa.contracts.instances.SoulboundIdentityContract[
      "ownerOf(uint256)"
    ](readerIdentityId);
  } catch {
    //
  }

  if (!readerAddress) {
    result.message = `No Identity address found for Identity ${readerIdentityId}`;
    console.error(result.message);
    return result;
  }

  let ownerAddress;
  try {
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
    console.log(
      `from Identity ${ownerIdentityId.toString()} (${ownerAddress}) ${
        ownerIdentityId.toString() === identityId?.toString() ? "You" : ""
      }`
    );
    console.log(
      `to Identity ${readerIdentityId.toString()} (${readerAddress}) ${
        readerIdentityId.toString() === identityId?.toString() ? "You" : ""
      }\n`
    );

    if (readerIdentityId.toString() === ownerIdentityId.toString()) {
      result.message = "Reader and owner identity must be different!";
      console.error(result.message);
      return result;
    }

    const links = (await loadLinks(masa, contract, tokenId)).filter(
      (link: Link) => link.exists
    );

    result.verified = false;
    for (const link of links) {
      try {
        result.verified =
          await masa.contracts.instances.SoulLinkerContract.validateLink(
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
      } catch (error: any) {
        switch (error.errorName) {
          case "ValidPeriodExpired":
            result.message = "Link expired!";
            break;
          default:
            console.error(error.errorName);
        }
      }
    }

    if (links.length < 1) {
      result.message = "Link not found!";
      console.error(result.message);
    }

    console.log({ validateLinkResult: result });
  } catch {
    console.error(`Token ${tokenId.toString()} does not exist!`);
  }

  return result;
};
