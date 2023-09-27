import type { LogDescription } from "@ethersproject/abi";
import type { Log } from "@ethersproject/abstract-provider";
import type { BaseContract } from "ethers";

import type { IIdentityContracts, MasaInterface } from "../interface";
import { MasaBase } from "../masa-base";
import { CreditScore } from "./contract-modules/credit-score";
import { Green } from "./contract-modules/green";
import { Identity } from "./contract-modules/identity";
import { ASBTContract } from "./contract-modules/sbt/ASBT";
import { SBTContract } from "./contract-modules/sbt/SBT/sbt-contract";
import { SSSBTContract } from "./contract-modules/sbt/SSSBT/sssbt-contract";
import { SoulLinker } from "./contract-modules/soul-linker";
import { SoulName } from "./contract-modules/soul-name";
import { loadIdentityContracts } from "./load-Identity-contracts";

export class MasaContracts extends MasaBase {
  /**
   * direct contract access
   */
  public instances: IIdentityContracts;
  /**
   * SBTs
   */
  public sbt: SBTContract;
  public sssbt: SSSBTContract;
  public asbt: ASBTContract;
  /**
   * Soul Linker
   */
  public soulLinker: SoulLinker;
  /**
   * Soul Name
   */
  public soulName: SoulName;
  /**
   * Credit Score
   */
  public creditScore: CreditScore;
  /**
   * Green
   */
  public green: Green;
  /**
   * Identity
   */
  public identity: Identity;

  public constructor({
    masa,
    contractOverrides,
  }: {
    masa: MasaInterface;
    contractOverrides?: Partial<IIdentityContracts>;
  }) {
    super(masa);

    this.instances = {
      ...loadIdentityContracts({
        signer: this.masa.config.signer,
        networkName: this.masa.config.networkName,
      }),
      ...contractOverrides,
    };

    /**
     * SBTS
     */
    this.sbt = new SBTContract(this.masa, this.instances);
    this.sssbt = new SSSBTContract(this.masa, this.instances);
    this.asbt = new ASBTContract(this.masa, this.instances);
    /**
     * Soul Linker
     */
    this.soulLinker = new SoulLinker(this.masa, this.instances);
    /**
     * Soul Name
     */
    this.soulName = new SoulName(this.masa, this.instances);
    /**
     * Identity
     */
    this.identity = new Identity(this.masa, this.instances);
    /**
     * Credit Score
     */
    this.creditScore = new CreditScore(this.masa, this.instances);
    /**
     * Greens
     */
    this.green = new Green(this.masa, this.instances);
  }

  /**
   *
   * @param logs
   * @param additionalContracts
   */
  public parseLogs = (
    logs: Log[],
    additionalContracts: BaseContract[] = [],
  ): LogDescription[] => {
    const parsedLogs: LogDescription[] = [];

    for (const contract of [
      ...Object.values(this.instances),
      ...additionalContracts,
    ]) {
      parsedLogs.push(
        ...logs
          .filter(
            (log: Log) =>
              log.address.toLowerCase() === contract.address.toLowerCase(),
          )
          .map((log: Log) => {
            let result;

            try {
              result = contract.interface.parseLog(log);
            } catch (error) {
              if (error instanceof Error) {
                console.warn(error.message);
              }
            }

            return result;
          }),
      );
    }

    return parsedLogs;
  };
}
