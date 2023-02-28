import { createGreen, generateGreen, mintGreen, verifyGreen } from "./create";
import { burnGreen } from "./burn";
import { listGreens, loadGreensByIdentityId } from "./list";
import { BigNumber } from "ethers";
import Masa from "../masa";
import { MasaSoulLinker } from "../soul-linker";
import { MasaBase } from "../helpers/masa-base";

export class MasaGreen extends MasaBase {
  public readonly links: MasaSoulLinker;

  constructor(masa: Masa) {
    super(masa);

    this.links = new MasaSoulLinker(
      this.masa,
      this.masa.contracts.instances.SoulboundGreenContract
    );
  }

  /**
   * Generates a new verification attempt
   * @param phoneNumber
   */
  generate = (phoneNumber: string) => generateGreen(this.masa, phoneNumber);

  /**
   * Tries to verify the current verification attempt
   * @param phoneNumber
   * @param code
   */
  verify = (phoneNumber: string, code: string) =>
    verifyGreen(this.masa, phoneNumber, code);

  /**
   * Mints a green based on the previously made verification result
   * @param authorityAddress
   * @param signatureDate
   * @param signature
   */
  mint = (authorityAddress: string, signatureDate: number, signature: string) =>
    mintGreen(this.masa, authorityAddress, signatureDate, signature);

  /**
   * Does the verification and mint step in one go
   * @param phoneNumber
   * @param code
   */
  create = (phoneNumber: string, code: string) =>
    createGreen(this.masa, phoneNumber, code);

  /**
   * Burns a green
   * @param greenId
   */
  burn = (greenId: number) => burnGreen(this.masa, greenId);

  /**
   * Lits all greens on the current network
   * @param address
   */
  list = (address?: string) => listGreens(this.masa, address);

  /**
   * Loads all greens for an identity on the current network
   * @param identityId
   */
  load = (identityId: BigNumber) =>
    loadGreensByIdentityId(this.masa, identityId);
}
