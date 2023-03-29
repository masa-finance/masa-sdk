import { BigNumber } from "ethers";
import Masa from "../masa";
import { CreditScoreDetails, ICreditScore } from "../interface";
import { patchMetadataUrl } from "../helpers";

export const loadCreditScoreByTokenId = async (
  masa: Masa,
  creditScoreId: BigNumber
): Promise<CreditScoreDetails> => {
  const tokenUri = patchMetadataUrl(
    masa,
    await masa.contracts.instances.SoulboundCreditScoreContract.tokenURI(
      creditScoreId
    )
  );

  if (masa.config.verbose) {
    console.info(`Credit Score Metadata URL: '${tokenUri}'`);
  }

  const metadata: ICreditScore | undefined = <ICreditScore | undefined>(
    await masa.client.metadata.get(tokenUri)
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
): Promise<CreditScoreDetails[]> => {
  const creditScoreIds: BigNumber[] =
    await masa.contracts.instances.SoulLinkerContract[
      "getSBTConnections(uint256,address)"
    ](
      identityId,
      masa.contracts.instances.SoulboundCreditScoreContract.address
    );

  return (
    await Promise.all(
      creditScoreIds.map(
        async (creditScoreId: BigNumber) =>
          await loadCreditScoreByTokenId(masa, creditScoreId)
      )
    )
  ).filter((creditScore: CreditScoreDetails) => !!creditScore.metadata);
};
