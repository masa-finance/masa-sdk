import Masa from "../masa";
import { signSoulLinkerLink } from "../helpers";
import { BigNumber } from "ethers";

export const grantAccess = async (
  masa: Masa,
  creditScoreId: number,
  receiverIdentityId: number
): Promise<boolean> => {
  let success = false;

  const identityId = await masa.identity.load();
  if (!identityId) {
    console.error(`No Identity found!`);
    return success;
  }

  const { signature, expirationDate, signatureDate } = await signSoulLinkerLink(
    masa,
    BigNumber.from(receiverIdentityId),
    identityId,
    masa.contracts.identity.SoulboundCreditScoreContract.address,
    BigNumber.from(creditScoreId)
  );

  console.log(signature, signatureDate, expirationDate);
  success = true;

  return success;
};
