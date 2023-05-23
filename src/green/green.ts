import { BigNumber } from "ethers";
import Masa from "../masa";
import { PaymentMethod } from "../interface";
import {
  createGreen,
  generateGreen,
  listGreens,
  loadGreens,
  mintGreen,
  verifyGreen,
} from "./";
import { MasaLinkable } from "../helpers";
import { SoulboundGreen } from "@masa-finance/masa-contracts-identity";

export class MasaGreen extends MasaLinkable<SoulboundGreen> {
  constructor(masa: Masa) {
    super(masa, masa.contracts.instances.SoulboundGreenContract);
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
  burn = (greenId: BigNumber) => this.masa.contracts.green.burn(greenId);

  /**
   * Lits all greens on the current network
   * @param address
   */
  list = (address?: string) => listGreens(this.masa, address);

  /**
   * Loads all greens for an identity on the current network
   * @param identityIdOrAddress
   */
  load = (identityIdOrAddress: BigNumber | string) =>
    loadGreens(this.masa, identityIdOrAddress);
}
