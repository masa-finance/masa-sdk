import { LogDescription } from "@ethersproject/abi";
import { Log } from "@ethersproject/abstract-provider";
import {
  MasaSBT,
  ReferenceSBTAuthority,
  ReferenceSBTSelfSovereign,
} from "@masa-finance/masa-contracts-identity";
import { BaseContract } from "ethers";

import { IIdentityContracts } from "../interface";
import { MasaBase } from "../interface/masa-base";
import { MasaInterface } from "../interface/masa-interface";
import { loadIdentityContracts } from "./load-Identity-contracts";
import {
  ASBT,
  CreditScore,
  Green,
  Identity,
  SBT,
  SoulLinker,
  SoulName,
  SSSBT,
} from "./modules";

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
