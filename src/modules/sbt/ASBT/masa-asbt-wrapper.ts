import type { ReferenceSBTAuthority } from "@masa-finance/masa-contracts-identity";

import type {
  BaseResult,
  BaseResultWithTokenId,
  PaymentMethod,
} from "../../../interface";
import { logger } from "../../../utils";
import { MasaSBTWrapper } from "../SBT/masa-sbt-wrapper";

export class MasaASBTWrapper<
  Contract extends ReferenceSBTAuthority,
> extends MasaSBTWrapper<Contract> {
  /**
   *
   * @param receiver
   * @param paymentMethod
   */
  public mint = async (
    receiver: string,
    paymentMethod: PaymentMethod = "ETH",
  ): Promise<BaseResultWithTokenId> => {
    const [name, symbol] = await Promise.all([
      this.contract.name(),
      this.contract.symbol(),
    ]);

    logger("log", `Minting ASBT on: '${this.masa.config.networkName}'`);
    logger("log", `Contract Name: '${name}'`);
    logger("log", `Contract Symbol: '${symbol}'`);
    logger("log", `Contract Address: '${this.contract.address}'`);
    logger("log", `To receiver: '${receiver}'`);

    const { mint } = this.masa.contracts.asbt.attach(this.contract);

    return mint(paymentMethod, receiver);
  };

  /**
   *
   * @param receivers
   * @param paymentMethod
   */
  public bulkMint = async (
    receivers: string[],
    paymentMethod: PaymentMethod = "ETH",
  ): Promise<BaseResult[]> => {
    const [name, symbol] = await Promise.all([
      this.contract.name(),
      this.contract.symbol(),
    ]);

    logger("log", `Bulk Minting ASBT on: '${this.masa.config.networkName}'`);
    logger("log", `Contract Name: '${name}'`);
    logger("log", `Contract Symbol: '${symbol}'`);
    logger("log", `Contract Address: '${this.contract.address}'`);
    logger("log", `To receiver: '${receivers}'`);

    const { bulkMint } = this.masa.contracts.asbt.attach(this.contract);

    return bulkMint(paymentMethod, receivers);
  };
}
