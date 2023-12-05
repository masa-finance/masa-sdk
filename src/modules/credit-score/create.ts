import { BaseErrorCodes, Messages } from "../../collections";
import { parseEthersError } from "../../contracts/contract-modules/ethers";
import type {
  GenerateCreditScoreResult,
  MasaInterface,
  PaymentMethod,
} from "../../interface";
import { logger } from "../../utils";

export const createCreditScore = async (
  masa: MasaInterface,
  paymentMethod: PaymentMethod,
): Promise<GenerateCreditScoreResult> => {
  let result: GenerateCreditScoreResult = {
    success: false,
    errorCode: BaseErrorCodes.UnknownError,
  };

  if (await masa.session.checkLogin()) {
    if (!masa.contracts.instances.SoulboundCreditScoreContract.hasAddress) {
      result.message = Messages.ContractNotDeployed(masa.config.networkName);
      result.errorCode = BaseErrorCodes.NetworkError;
      return result;
    }

    logger("log", "Creating Credit Score ...");

    const { identityId, address } = (await masa.identity.load()) || {};
    if (!identityId) {
      result.message = Messages.NoIdentity(address);
      result.errorCode = BaseErrorCodes.DoesNotExist;
      return result;
    }

    const balance =
      await masa.contracts.instances.SoulboundCreditScoreContract.balanceOf(
        address,
      );

    if (balance.toNumber() > 0) {
      result.message = "Credit Score already created!";
      result.errorCode = BaseErrorCodes.AlreadyExists;
      return result;
    }

    const creditScoreResponse = await masa.client.creditScore.generate();

    if (creditScoreResponse) {
      result.message = creditScoreResponse.message;

      if (
        creditScoreResponse.signature &&
        creditScoreResponse.signatureDate &&
        creditScoreResponse.authorityAddress
      ) {
        try {
          const { wait, hash } = await masa.contracts.creditScore.mint(
            paymentMethod,
            identityId,
            creditScoreResponse.authorityAddress,
            creditScoreResponse.signatureDate,
            creditScoreResponse.signature,
          );

          logger(
            "log",
            Messages.WaitingToFinalize(
              hash,
              masa.config.network?.blockExplorerUrls?.[0],
            ),
          );

          const { transactionHash } = await wait();

          logger("log", "Updating Credit Score Record!");

          const creditScoreUpdateResponse =
            await masa.client.creditScore.update(transactionHash);

          if (masa.config.verbose) {
            logger("dir", { creditScoreUpdateResponse });
          }

          result = {
            ...result,
            ...creditScoreUpdateResponse,
          };
        } catch (error: unknown) {
          result.message = "Unexpected error: ";

          const { message, errorCode } = parseEthersError(error);
          result.message += message;
          result.errorCode = errorCode;

          logger("error", result);
        }
      }
    }
  } else {
    result.message = Messages.NotLoggedIn();
    result.errorCode = BaseErrorCodes.NotLoggedIn;
  }

  return result;
};
