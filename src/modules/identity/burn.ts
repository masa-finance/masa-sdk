import { Messages } from "../../collections";
import type { BaseResult, MasaInterface } from "../../interface";

export const burnIdentity = async (
  masa: MasaInterface,
): Promise<BaseResult> => {
  const { identityId, address } = await masa.identity.load();
  if (!identityId) {
    console.error(Messages.NoIdentity(address));
    return { success: false };
  }

  return masa.contracts.identity.burn(identityId);
};
