import Masa from "../masa";

export const burnCreditScoreById = async (
  masa: Masa,
  creditScoreId: number
) => {
  const identityContracts = await masa.contracts.loadIdentityContracts();

  try {
    const tx = await identityContracts.SoulboundCreditReportContract.connect(
      masa.config.wallet
    ).burn(creditScoreId);

    console.log("Waiting for the burn tx to finalize");
    await tx.wait();

    console.log(`Credit Score with id ${creditScoreId} burned!`);
  } catch (err: any) {
    console.error(`Burning of Credit Score Failed! ${err.message}`);
  }
};

export const burnCreditScore = async (masa: Masa, creditScoreId: number) => {
  if (await masa.session.checkLogin()) {
    const identityId = await masa.identity.load();
    if (!identityId) {
      return;
    }

    await burnCreditScoreById(masa, creditScoreId);

    console.log(`Burning Credit Score with id ${creditScoreId}!`);
  } else {
    console.log("Not logged in please login first");
  }
};
