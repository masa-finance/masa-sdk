import type { BigNumber, Contract } from "ethers";

import { BaseErrorCodes } from "../../collections";
import type { BaseResult, MasaInterface } from "../../interface";
import { Link, loadLinks } from "./list-links";

export type VerifyLinkResult = BaseResult & { verified?: boolean };

export const verifyLink = async (
  masa: MasaInterface,
  contract: Contract,
  tokenId: BigNumber,
  readerIdentityId?: BigNumber,
): Promise<VerifyLinkResult> => {
  const result: VerifyLinkResult = {
    success: false,
    errorCode: BaseErrorCodes.UnknownError,
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
    const { "ownerOf(uint256)": ownerOf } =
      masa.contracts.instances.SoulboundIdentityContract;

    readerAddress = await ownerOf(readerIdentityId);
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
      (ownerAddress = await contract.ownerOf(tokenId)),
    );

    if (!ownerIdentityId) {
      result.message = "Owner identity not found";
      console.error(result.message);
      return result;
    }

    console.log(
      `Verifying link for '${await contract.name()}' (${
        contract.address
      }) ID: ${tokenId.toString()}`,
    );
    console.log(
      `from Identity ${ownerIdentityId.toString()} (${ownerAddress}) ${
        ownerIdentityId.toString() === identityId?.toString() ? "You" : ""
      }`,
    );
    console.log(
      `to Identity ${readerIdentityId.toString()} (${readerAddress}) ${
        readerIdentityId.toString() === identityId?.toString() ? "You" : ""
      }\n`,
    );

    if (readerIdentityId.toString() === ownerIdentityId.toString()) {
      result.message = "Reader and owner identity must be different!";
      console.error(result.message);
      return result;
    }

    const links = (await loadLinks(masa, contract, tokenId)).filter(
      (link: Link) => link.exists,
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
            link.signatureDate,
          );

        if (result.verified) {
          result.success = true;
          delete result.errorCode;
          break;
        }
      } catch (error: unknown) {
        switch ((error as { errorName: string }).errorName) {
          case "ValidPeriodExpired":
            result.message = "Link expired!";
            break;
          default:
            console.error((error as { errorName: string }).errorName);
        }
      }
    }

    if (links.length < 1) {
      result.message = "Link not found!";
      result.errorCode = BaseErrorCodes.NotFound;

      console.error(result.message);
    }

    console.log({ validateLinkResult: result });
  } catch {
    result.message = `Token ${tokenId.toString()} does not exist!`;
    console.error(result.message);
  }

  return result;
};
