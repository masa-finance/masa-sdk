import Masa from "../masa";
import { PaymentMethod } from "../contracts";
import { BigNumber, Contract, Signer } from "ethers";
import { BaseResult, IPassport } from "../interface";
import { parsePassport } from "./passport";
import { ErrorMessage } from "../utils";

export type EstablishLinkResult = BaseResult;

export const establishLinkFromPassport = async (
  masa: Masa,
  contract: Contract,
  passport: string,
  paymentMethod: PaymentMethod
) => {
  const unpackedPassport: IPassport = parsePassport(passport);

  return establishLink(
    masa,
    contract,
    paymentMethod,
    BigNumber.from(unpackedPassport.tokenId),
    BigNumber.from(unpackedPassport.readerIdentityId),
    unpackedPassport.signature,
    unpackedPassport.signatureDate,
    unpackedPassport.expirationDate
  );
};

export const establishLink = async (
  masa: Masa,
  contract: Contract,
  paymentMethod: PaymentMethod,
  tokenId: BigNumber,
  readerIdentityId: BigNumber,
  signature: string,
  signatureDate: number,
  expirationDate: number
): Promise<EstablishLinkResult> => {
  const result: EstablishLinkResult = {
    success: false,
    message: "Unknown Error",
  };

  const { identityId, address } = await masa.identity.load();
  if (!identityId) {
    result.message = ErrorMessage.NoIdentity(address);
    return result;
  }

  if (identityId.toString() !== readerIdentityId.toString()) {
    result.message = `Reader identity mismatch! This passport was issued for ${readerIdentityId.toString()}`;
    console.error(result.message);
    return result;
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
    `Establishing link for '${await contract.name()}' (${
      contract.address
    }) ID: ${tokenId.toString()}`
  );
  console.log(`from Identity ${ownerIdentityId.toString()} (${ownerAddress})`);
  console.log(`to Identity ${identityId.toString()} (${address})\n`);

  await masa.contracts.addLink(
    masa.config.wallet as Signer,
    contract.address,
    paymentMethod,
    readerIdentityId,
    ownerIdentityId,
    BigNumber.from(tokenId),
    signatureDate,
    expirationDate,
    signature
  );

  result.success = true;

  return result;
};
