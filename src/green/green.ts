import { createGreen, generateGreen, mintGreen, verifyGreen } from "./create";
import { burnGreen } from "./burn";
import { listGreens, loadGreensByIdentityId } from "./list";
import { BigNumber } from "ethers";
import Masa from "../masa";
import { MasaSoulLinker } from "../soul-linker";
import { MasaBase } from "../helpers/masa-base";
import { PaymentMethod } from "../contracts";

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
   * @param paymentMethod
   * @param authorityAddress
   * @param signatureDate
   * @param signature
   */
  mint = (
    paymentMethod: PaymentMethod = "ETH",
    authorityAddress: string,
    signatureDate: number,
    signature: string
  ) =>
    mintGreen(
      this.masa,
      paymentMethod,
      authorityAddress,
      signatureDate,
      signature
    );

  /**
   * Does the verification and mint step in one go
   * @param paymentMethod
   * @param phoneNumber
   * @param code
   */
  create = (
    paymentMethod: PaymentMethod = "ETH",
    phoneNumber: string,
    code: string
  ) => createGreen(this.masa, paymentMethod, phoneNumber, code);

  /**
   * Burns a green
   * @param greenId
   */
  burn = (greenId: BigNumber) => burnGreen(this.masa, greenId);

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
