import type { ReferenceSBTSelfSovereign } from "@masa-finance/masa-contracts-identity";

import type { BaseResultWithTokenId, PaymentMethod } from "../../../interface";
import { logger } from "../../../utils";
import { MasaSBTWrapper } from "../SBT/masa-sbt-wrapper";

export class MasaSSSBTWrapper<
  Contract extends ReferenceSBTSelfSovereign,
> extends MasaSBTWrapper<Contract> {
  /**
   *
   * @param receiver
   */
  sign = async (receiver: string) => {
    let result:
      | {
          authorityAddress: string;
          signatureDate: number;
          signature: string;
        }
      | undefined;

    const [name, symbol] = await Promise.all([
      this.contract.name(),
      this.contract.symbol(),
    ]);

    logger("log", `Signing SSSBT on: '${this.masa.config.networkName}'`);
    logger("log", `Contract Name: '${name}'`);
    logger("log", `Contract Symbol: '${symbol}'`);
    logger("log", `Contract Address: '${this.contract.address}'`);
    logger("log", `To receiver: '${receiver}'`);

    const signatureDate = Date.now();

    // fill the collection with data
    const value: {
      to: string;
      authorityAddress: string;
      signatureDate: number;
    } = {
      to: receiver,
      authorityAddress: await this.masa.config.signer.getAddress(),
      signatureDate,
    };

    const { sign, types } = this.masa.contracts.sssbt.attach(this.contract);

    // sign to create a signature
    const signResult = await sign("ReferenceSBTSelfSovereign", types, value);

    if (signResult) {
      const { signature, authorityAddress } = signResult;

      if (this.masa.config.verbose) {
        logger("dir", {
          signature,
          authorityAddress,
          signatureDate,
        });
      }

      result = {
        authorityAddress,
        signatureDate,
        signature,
      };
    }

    return result;
  };

  /**
   *
   * @param authorityAddress
   * @param signatureDate
   * @param signature
   * @param paymentMethod
   */
  mint = async (
    authorityAddress: string,
    signatureDate: number,
    signature: string,
    paymentMethod: PaymentMethod = "ETH",
  ): Promise<BaseResultWithTokenId> => {
    const receiver = await this.masa.config.signer.getAddress();

    const [name, symbol] = await Promise.all([
      this.contract.name(),
      this.contract.symbol(),
    ]);

    logger("log", `Minting SSSBT on: '${this.masa.config.networkName}'`);
    logger("log", `Contract Name: '${name}'`);
    logger("log", `Contract Symbol: '${symbol}'`);
    logger("log", `Contract Address: '${this.contract.address}'`);
    logger("log", `To receiver: '${receiver}'`);

    const { mint } = this.masa.contracts.sssbt.attach(this.contract);

    return mint(
      paymentMethod,
      receiver,
      signature,
      signatureDate,
      authorityAddress,
    );
  };
}
