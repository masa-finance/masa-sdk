import type { ReferenceSBTAuthority } from "@masa-finance/masa-contracts-identity";

import type { PaymentMethod } from "../../../interface";
import { MasaSBTWrapper } from "../SBT/masa-sbt-wrapper";

export class MasaASBTWrapper<
  Contract extends ReferenceSBTAuthority
> extends MasaSBTWrapper<Contract> {
  /**
   *
   * @param receiver
   * @param paymentMethod
   */
  mint = async (receiver: string, paymentMethod: PaymentMethod = "ETH") => {
    const [name, symbol] = await Promise.all([
      this.contract.name(),
      this.contract.symbol(),
    ]);

    console.log(`Minting ASBT on: '${this.masa.config.networkName}'`);
    console.log(`Contract Name: '${name}'`);
    console.log(`Contract Symbol: '${symbol}'`);
    console.log(`Contract Address: '${this.contract.address}'`);
    console.log(`To receiver: '${receiver}'`);

    const { mint } = await this.masa.contracts.asbt.attach(this.contract);

    return mint(paymentMethod, receiver);
  };

  /**
   *
   * @param receivers
   * @param paymentMethod
   */
  bulkMint = async (
    receivers: string[],
    paymentMethod: PaymentMethod = "ETH"
  ) => {
    const [name, symbol] = await Promise.all([
      this.contract.name(),
      this.contract.symbol(),
    ]);

    console.log(`Bulk Minting ASBT on: '${this.masa.config.networkName}'`);
    console.log(`Contract Name: '${name}'`);
    console.log(`Contract Symbol: '${symbol}'`);
    console.log(`Contract Address: '${this.contract.address}'`);
    console.log(`To receiver: '${receivers}'`);

    const { bulkMint } = await this.masa.contracts.asbt.attach(this.contract);

    return bulkMint(paymentMethod, receivers);
  };
}
