import { BigNumber } from "ethers";
import Masa from "../masa";
import { CreditScoreDetails, ICreditScore } from "../interface";
import { patchMetadataUrl } from "../helpers";
import { isBigNumber } from "../utils";

export const loadCreditScoreDetails = async (
  masa: Masa,
  creditScoreIds: BigNumber[]
): Promise<CreditScoreDetails[]> => {
  return (
    await Promise.all(
      creditScoreIds.map(async (tokenId: BigNumber) => {
        const tokenUri = patchMetadataUrl(
          masa,
          await masa.contracts.instances.SoulboundCreditScoreContract.tokenURI(
            tokenId
          )
        );

        if (masa.config.verbose) {
          console.info(`Credit Score Metadata URL: '${tokenUri}'`);
        }

        const metadata = <ICreditScore | undefined>(
          await masa.client.metadata.get(tokenUri)
        );

        return {
          tokenId,
          tokenUri,
          metadata,
        };
      })
    )
  ).filter((creditScore: CreditScoreDetails) => !!creditScore.metadata);
};

export const loadCreditScores = async (
  masa: Masa,
  identityIdOrAddress: BigNumber | string
): Promise<CreditScoreDetails[]> => {
  let creditScoreIds: BigNumber[] = [];

  try {
    if (masa.contracts.instances.SoulLinkerContract.hasAddress) {
      const {
        "getSBTConnections(address,address)": getSBTConnectionsByAddress,
        "getSBTConnections(uint256,address)": getSBTConnectionsByIdentity,
      } = masa.contracts.instances.SoulLinkerContract;

      creditScoreIds = await (isBigNumber(identityIdOrAddress)
        ? getSBTConnectionsByIdentity(
            identityIdOrAddress,
            masa.contracts.instances.SoulboundCreditScoreContract.address
          )
        : getSBTConnectionsByAddress(
            identityIdOrAddress,
            masa.contracts.instances.SoulboundCreditScoreContract.address
          ));
    } else if (!isBigNumber(identityIdOrAddress)) {
      const balance: number = (
        await masa.contracts.instances.SoulboundCreditScoreContract.balanceOf(
          identityIdOrAddress
        )
      ).toNumber();

      if (balance > 0) {
        for (let i = 0; i < balance; i++) {
          creditScoreIds.push(
            await masa.contracts.instances.SoulboundCreditScoreContract.tokenOfOwnerByIndex(
              identityIdOrAddress,
              i
            )
          );
        }
      }
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Loading credit scores failed! ${error.message}`);
    }
  }

  return loadCreditScoreDetails(masa, creditScoreIds);
};
