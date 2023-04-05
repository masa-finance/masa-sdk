import { IIdentityContracts } from "../interface";
import Masa from "../masa";
import { loadIdentityContracts } from "./index";
import {
  CreditScore,
  Green,
  Identity,
  SBT,
  SoulLinker,
  SoulName,
} from "./modules";
import { MasaBase } from "../helpers/masa-base";
import { Log } from "@ethersproject/abstract-provider";
import { BaseContract } from "ethers";
import { LogDescription } from "@ethersproject/abi";

export class MasaContracts extends MasaBase {
  public instances: IIdentityContracts;
  public sbt: SBT;
  public soulLinker: SoulLinker;
  public soulName: SoulName;
  public creditScore: CreditScore;
  public green: Green;
  public identity: Identity;

  public constructor(masa: Masa) {
    super(masa);

    this.instances = loadIdentityContracts({
      provider: this.masa.config.wallet.provider,
      networkName: this.masa.config.networkName,
    });

    this.sbt = new SBT(this.masa, this.instances);
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
