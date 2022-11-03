import { create2fa } from "./create";
import { burn2fa } from "./burn";
import { list2fas, load2faByIdentityId } from "./list";
import { BigNumber } from "ethers";
import Masa from "../masa";

export const twofa = (masa: Masa) => ({
  mint: (address: string, signature: string) =>
    masa.client.twofaMint(address, signature),
  create: () => create2fa(masa),
  burn: (twofaId: number) => burn2fa(masa, twofaId),
  list: (address?: string) => list2fas(masa, address),
  load: (identityId: BigNumber) => load2faByIdentityId(masa, identityId),
});
