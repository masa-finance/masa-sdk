import { BaseErrorCodes, Messages } from "../../collections";
import type { BaseResult, MasaInterface } from "../../interface";

export const burnIdentity = async (
  masa: MasaInterface,
): Promise<BaseResult> => {
  let result: BaseResult = {
    success: false,
    errorCode: BaseErrorCodes.UnknownError,
  };

  const { identityId, address } = await masa.identity.load();

  if (identityId) {
    result = await masa.contracts.identity.burn(identityId);
  } else {
    result.message = Messages.NoIdentity(address);
    result.errorCode = BaseErrorCodes.DoesNotExist;
  }

  return result;
};
