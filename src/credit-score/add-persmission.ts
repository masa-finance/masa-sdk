import Masa from "../masa";
import { PaymentMethod } from "../contracts";
import { BigNumber, Signer } from "ethers";

export const addPermission = async (
  masa: Masa,
  creditScoreId: number,
  signature: string,
  paymentMethod: PaymentMethod,
  signatureDate: number,
  expirationDate: number
): Promise<boolean> => {
  let success = false;

  const identityId = await masa.identity.load();
  if (!identityId) {
    console.error(`No Identity found!`);
    return success;
  }

  const ownerIdentityId = await masa.identity.load(
    await masa.contracts.identity.SoulboundCreditScoreContract.ownerOf(
      creditScoreId
    )
  );

  if (!ownerIdentityId) {
    console.error("Owner identity not found");
    return success;
  }

  await masa.contracts.addPermission(
    masa.config.wallet as Signer,
    masa.contracts.identity.SoulboundCreditScoreContract.address,
    paymentMethod,
    identityId,
    ownerIdentityId,
    BigNumber.from(creditScoreId),
    signatureDate,
    expirationDate,
    signature
  );

  success = true;

  return success;
};
