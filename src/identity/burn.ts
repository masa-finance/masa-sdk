import { MasaInterface } from "../interface";
import { Messages } from "../utils";

export const burnIdentity = async (masa: MasaInterface): Promise<boolean> => {
  const { identityId, address } = await masa.identity.load();
  if (!identityId) {
    console.error(Messages.NoIdentity(address));
    return false;
  }

  return masa.contracts.identity.burn(identityId);
};
