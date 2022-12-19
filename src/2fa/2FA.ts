import { create2FA } from "./create";
import { burn2FA } from "./burn";
import { list2FAs, load2FAsByIdentityId } from "./list";
import { BigNumber } from "ethers";
import Masa from "../masa";
import { MasaSoulLinker } from "../soul-linker"

export class Masa2FA {
  public readonly links: MasaSoulLinker;

  constructor(private masa: Masa) {
    this.links = new MasaSoulLinker(
      this.masa,
      this.masa.contracts.identity.Soulbound2FAContract
    );
  }

  mint = (
    address: string,
    phoneNumber: string,
    code: string,
    signature: string
  ) => this.masa.client.twoFAMint(address, phoneNumber, code, signature);
  generate = (phoneNumber: string) =>
    this.masa.client.twoFAGenerate(phoneNumber);
  create = (phoneNumber: string, code: string) =>
    create2FA(this.masa, phoneNumber, code);
  burn = (twoFAId: number) => burn2FA(this.masa, twoFAId);
  list = (address?: string) => list2FAs(this.masa, address);
  load = (identityId: BigNumber) => load2FAsByIdentityId(this.masa, identityId);
}
