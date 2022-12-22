import Masa from "../masa";
import { PaymentMethod } from "../contracts";
import { BigNumber, Contract, Signer } from "ethers";
import { BaseResult, IPassport } from "../interface";

export type EstablishLinkResult = BaseResult;

export const establishLinkFromPassport = async (
  masa: Masa,
  contract: Contract,
  passport: string,
  paymentMethod: PaymentMethod
) => {
  const unpackedPassport: IPassport = JSON.parse(atob(passport));

  return establishLink(
    masa,
    contract,
    BigNumber.from(unpackedPassport.tokenId),
    unpackedPassport.signature,
    paymentMethod,
    unpackedPassport.signatureDate,
    unpackedPassport.expirationDate
  );
};

export const establishLink = async (
  masa: Masa,
  contract: Contract,
  tokenId: BigNumber,
  signature: string,
  paymentMethod: PaymentMethod,
  signatureDate: number,
  expirationDate: number
): Promise<EstablishLinkResult> => {
  const result: EstablishLinkResult = {
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

  console.log(paymentMethod);

  await masa.contracts.addPermission(
    masa.config.wallet as Signer,
    contract.address,
    paymentMethod,
    identityId,
    ownerIdentityId,
    BigNumber.from(tokenId),
    signatureDate,
    expirationDate,
    signature
  );

  result.success = true;

  return result;
};
