import Masa from "../masa";
import { signSoulLinkerLink } from "../helpers";
import { BigNumber, Contract } from "ethers";
import { BaseResult } from "../interface";

export type CreateLinkResult = BaseResult;

export const createLink = async (
  masa: Masa,
  contract: Contract,
  tokenId: BigNumber,
  receiverIdentityId: BigNumber
): Promise<CreateLinkResult> => {
  const result: CreateLinkResult = {
    success: false,
    message: "Unknown Error",
  };

  const { identityId, address } = await masa.identity.load();

  if (!identityId) {
    result.message = `No Identity found for address ${address}`;
    return result;
  }

  const { signature, signatureDate, expirationDate } = await signSoulLinkerLink(
    masa,
    BigNumber.from(receiverIdentityId),
    identityId,
    contract.address,
    BigNumber.from(tokenId)
  );

  console.log(signature, signatureDate, expirationDate);

  console.log(
    btoa(JSON.stringify({ signature, signatureDate, expirationDate }, null, 2))
  );

  result.success = true;

  return result;
};
