import { BigNumber } from "ethers";
import Masa from "../masa";

export const loadCreditScoresByIdentityId = async (
  masa: Masa,
  identityId: BigNumber
): Promise<any[]> => {
  const creditReports = [];
  const identityContracts = await masa.contracts.loadIdentityContracts();

  const address = await identityContracts.SoulboundIdentityContract[
    "ownerOf(uint256)"
  ](identityId);

  // todo find a better way to get the owner of a credit report then by address (identity id)
  const creditReportBalance =
    await identityContracts.SoulboundCreditReportContract.balanceOf(address);

  if (creditReportBalance.toNumber() > 0) {
    for (
      let creditReportIndex = 0;
      creditReportBalance < creditReportBalance;
      creditReportIndex++
    ) {
      const tokenId =
        await identityContracts.SoulboundCreditReportContract.tokenOfOwnerByIndex(
          address,
          creditReportIndex
        );

      const tokenUri = masa.metadata.patchMetadataUrl(
        await identityContracts.SoulNameContract["tokenURI(uint256)"](tokenId)
      );

      const metadata = await masa.metadata.getMetadata(tokenUri);

      creditReports.push({
        tokenId,
        tokenUri,
        metadata,
      });
    }
  }

  return creditReports;
};

export const listCreditReports = async (masa: Masa, address?: string) => {
  if (await masa.session.checkLogin()) {
    address = address || (await masa.config.wallet.getAddress());

    const identityId = await masa.identity.load(address);
    if (!identityId) return;

    const creditReports = await loadCreditScoresByIdentityId(masa, identityId);

    if (creditReports.length === 0) console.log("No Credit Reports found");

    for (const creditReport of creditReports) {
      console.log(
        `Metadata: ${JSON.stringify(creditReport.metadata, null, 2)}`
      );
    }
  } else {
    console.log("Not logged in please login first");
  }
};
