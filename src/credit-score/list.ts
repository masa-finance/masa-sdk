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
    metadata?: ICreditScore;
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
      const metadata: ICreditScore | undefined = <ICreditScore | undefined>(
        await masa.metadata.retrieve(tokenUri)
      );

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
  {
    tokenId: BigNumber;
    tokenUri: string;
    metadata?: ICreditScore;
  }[]
> => {
  address = address || (await masa.config.wallet.getAddress());

  const identityId = await masa.identity.load(address);
  if (!identityId) return [];

  const creditScores = await loadCreditScoresByIdentityId(masa, identityId);

  if (creditScores.length === 0) console.log("No Credit Scores found");

  let i = 1;
  for (const creditScore of creditScores) {
    console.log(`Token: ${i}`);
    console.log(`Token ID: ${creditScore.tokenId}`);
    i++;
    if (creditScore.metadata) {
      console.log(`Metadata: ${JSON.stringify(creditScore.metadata, null, 2)}`);
    }
  }

  return creditScores;
};
