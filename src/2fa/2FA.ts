import { create2FA } from "./create";
import { burn2FA } from "./burn";
import { list2FAs, load2FAsByIdentityId } from "./list";
import { BigNumber } from "ethers";
import Masa from "../masa";

export const twoFA = (masa: Masa) => ({
  mint: (
    address: string,
    phoneNumber: string,
    code: string,
    signature: string
  ) => masa.client.twoFAMint(address, phoneNumber, code, signature),
  generate: (phoneNumber: string) => masa.client.twoFAGenerate(phoneNumber),
  create: (phoneNumber: string, code: string) =>
    create2FA(masa, phoneNumber, code),
  burn: (twoFAId: number) => burn2FA(masa, twoFAId),
  list: (address?: string) => list2FAs(masa, address),
  load: (identityId: BigNumber) => load2FAsByIdentityId(masa, identityId),
});
