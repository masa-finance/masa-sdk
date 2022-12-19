import Masa from "../masa";
import { BigNumber, Contract } from "ethers";
import { BaseResult } from "../interface";

export type ListLinksResult = BaseResult;

export const listLinks = async (
  masa: Masa,
  contract: Contract,
  tokenId: BigNumber,
  readerIdentityId: BigNumber
): Promise<ListLinksResult> => {
  const result: ListLinksResult = {
    success: false,
    message: "Unknown Error",
  };

  const { identityId, address } = await masa.identity.load();

  if (!identityId) {
    result.message = `No Identity found for address ${address}`;
    return result;
  }

  const creditScoreIds: BigNumber[] =
    await masa.contracts.identity.SoulLinkerContract[
      "getSBTLinks(uint256,address)"
    ](identityId, masa.contracts.identity.SoulboundCreditScoreContract.address);

  console.log(creditScoreIds[0].toString());

  const signatureDates =
    await masa.contracts.identity.SoulLinkerContract.getPermissionSignatureDates(
      contract.address,
      tokenId,
      readerIdentityId
    );

  console.log(signatureDates);

  for (const signatureDate of signatureDates) {
    const info =
      await masa.contracts.identity.SoulLinkerContract.getPermissionInfo(
        contract.address,
        tokenId,
        readerIdentityId,
        signatureDate
      );

    console.log(info);
  }

  result.success = true;

  return result;
};
