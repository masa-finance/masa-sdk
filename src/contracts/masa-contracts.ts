import type { LogDescription } from "@ethersproject/abi";
import type { Log } from "@ethersproject/abstract-provider";
import type {
  MasaSBT,
  ReferenceSBTAuthority,
  ReferenceSBTSelfSovereign,
} from "@masa-finance/masa-contracts-identity";
import type { BaseContract } from "ethers";

import { MasaBase } from "../base/masa-base";
import type { IIdentityContracts, MasaInterface } from "../interface";
import { loadIdentityContracts } from "./load-Identity-contracts";
import { CreditScore, Green, Identity, SoulLinker, SoulName } from "./modules";
import { ASBT } from "./modules/sbt/ASBT";
import { SBT } from "./modules/sbt/sbt";
import { SSSBT } from "./modules/sbt/SSSBT";

export class MasaContracts extends MasaBase {
  public instances: IIdentityContracts;
  public sbt: SBT<MasaSBT>;
  public sssbt: SSSBT<ReferenceSBTSelfSovereign>;
  public asbt: ASBT<ReferenceSBTAuthority>;
  public soulLinker: SoulLinker;
  public soulName: SoulName;
  public creditScore: CreditScore;
  public green: Green;
  public identity: Identity;

  public constructor(
    masa: MasaInterface,
    contractOverrides?: Partial<IIdentityContracts>
  ) {
    super(masa);

    this.instances = {
      ...loadIdentityContracts({
        provider: this.masa.config.signer.provider,
        networkName: this.masa.config.networkName,
      }),
      ...contractOverrides,
    };

    this.sbt = new SBT(this.masa, this.instances);
    this.sssbt = new SSSBT(this.masa, this.instances);
    this.asbt = new ASBT(this.masa, this.instances);
    this.soulLinker = new SoulLinker(this.masa, this.instances);
    this.soulName = new SoulName(this.masa, this.instances);
    this.identity = new Identity(this.masa, this.instances);
    this.creditScore = new CreditScore(this.masa, this.instances);
    this.green = new Green(this.masa, this.instances);
  }

  /**
   *
   * @param logs
   * @param additionalContracts
   */
  public parseLogs = (
    logs: Log[],
    additionalContracts: BaseContract[] = []
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
              log.address.toLowerCase() === contract.address.toLowerCase()
          )
          .map((log: Log) => {
            try {
              return contract.interface.parseLog(log);
            } catch (error) {
              if (error instanceof Error) {
                console.warn(error.message);
              }
            }
          })
      );
    }

    return parsedLogs;
  };
}
