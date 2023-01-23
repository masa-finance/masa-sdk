import { BigNumber } from "ethers";
import Masa from "../masa";
import { ICreditScore } from "../interface";
import { patchMetadataUrl } from "../helpers";

export const loadCreditScoreByTokenId = async (
  masa: Masa,
  creditScoreId: BigNumber
): Promise<{
  tokenId: BigNumber;
  tokenUri: string;
  metadata?: ICreditScore;
}> => {
  const tokenUri = patchMetadataUrl(
    masa,
    await masa.contracts.identity.SoulboundCreditScoreContract.tokenURI(
      creditScoreId
    )
  );

  console.log(`Credit Score Metadata URL: '${tokenUri}'`);
  const metadata: ICreditScore | undefined = <ICreditScore | undefined>(
    await masa.metadata.retrieve(tokenUri)
  );

  return {
    tokenId: creditScoreId,
    tokenUri,
    metadata,
  };
};

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
      "getSBTConnections(uint256,address)"
    ](identityId, masa.contracts.identity.SoulboundCreditScoreContract.address);

  const creditScores = await Promise.all(
    creditScoreIds.map(async (creditScoreId) =>
      loadCreditScoreByTokenId(masa, creditScoreId)
    )
  );

  const creditScoresWithMetadata = creditScores.filter((m) => !!m.metadata);

  return creditScoresWithMetadata;
};

export const listCreditScores = async (
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

  const { identityId } = await masa.identity.load(address);
  if (!identityId) return [];

  const creditScores = await loadCreditScoresByIdentityId(masa, identityId);

  if (creditScores.length === 0) console.log("No Credit Scores found!");

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
