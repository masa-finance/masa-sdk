import type { ReferenceSBTSelfSovereign } from "@masa-finance/masa-contracts-identity";

import type { BaseResultWithTokenId, PaymentMethod } from "../../../interface";
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

    console.log(`Signing SSSBT on: '${this.masa.config.networkName}'`);
    console.log(`Contract Name: '${name}'`);
    console.log(`Contract Symbol: '${symbol}'`);
    console.log(`Contract Address: '${this.contract.address}'`);
    console.log(`To receiver: '${receiver}'`);

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
        console.info({
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

    console.log(`Minting SSSBT on: '${this.masa.config.networkName}'`);
    console.log(`Contract Name: '${name}'`);
    console.log(`Contract Symbol: '${symbol}'`);
    console.log(`Contract Address: '${this.contract.address}'`);
    console.log(`To receiver: '${receiver}'`);

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
