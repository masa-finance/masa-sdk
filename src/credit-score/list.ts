import { BigNumber } from "ethers";
import Masa from "../masa";
import { ICreditScore } from "../interface";
import { patchMetadataUrl } from "../helpers";

export const loadCreditScoresByIdentityId = async (
  masa: Masa,
  identityId: BigNumber
): Promise<
  {
    tokenId: BigNumber;
    tokenUri: string;
    metadata: ICreditScore;
  }[]
> => {
  const creditScoreIds: BigNumber[] =
    await masa.contracts.identity.SoulLinkerContract[
      "getSBTLinks(uint256,address)"
    ](
      identityId,
      masa.contracts.identity.SoulboundCreditReportContract.address
    );

  return await Promise.all(
    creditScoreIds.map(async (tokenId) => {
      const tokenUri = patchMetadataUrl(
        masa,
        await masa.contracts.identity.SoulboundCreditReportContract.tokenURI(
          tokenId
        )
      );

      console.log(`Metadata Url: ${tokenUri}`);
      const metadata = (await masa.metadata.retrieve(tokenUri)) as ICreditScore;

      return {
        tokenId,
        tokenUri,
        metadata,
      };
    })
  );
};

export const listCreditReports = async (
  masa: Masa,
  address?: string
): Promise<
  | {
      tokenId: BigNumber;
      tokenUri: string;
      metadata: ICreditScore;
    }[]
  | undefined
> => {
  address = address || (await masa.config.wallet.getAddress());

  const identityId = await masa.identity.load(address);
  if (!identityId) return;

  const creditReports = await loadCreditScoresByIdentityId(masa, identityId);

  if (creditReports.length === 0) console.log("No Credit Scores found");

  for (const creditReport of creditReports) {
    console.log(`Metadata: ${JSON.stringify(creditReport.metadata, null, 2)}`);
  }

  return creditReports;
};
