import { create2fa } from "./create";
import { burn2fa } from "./burn";
import { list2fas, load2fasByIdentityId } from "./list";
import { BigNumber } from "ethers";
import Masa from "../masa";

export const twofa = (masa: Masa) => ({
  mint: (
    address: string,
    phoneNumber: string,
    code: string,
    signature: string
  ) => masa.client.twoFAMint(address, phoneNumber, code, signature),
  generate: (phoneNumber: string) => masa.client.twoFAGenerate(phoneNumber),
  create: (phoneNumber: string, code: string) =>
    create2fa(masa, phoneNumber, code),
  burn: (twofaId: number) => burn2fa(masa, twofaId),
  list: (address?: string) => list2fas(masa, address),
  load: (identityId: BigNumber) => load2fasByIdentityId(masa, identityId),
});
