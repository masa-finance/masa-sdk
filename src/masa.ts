import { SupportedNetworks } from "./collections";
import { MasaContracts } from "./contracts";
import type { MasaArgs, MasaConfig, MasaInterface } from "./interface";
import {
  MasaAccount,
  MasaASBT,
  MasaCreditScore,
  MasaDynamicSBTBase,
  MasaDynamicSSSBT,
  MasaGreen,
  MasaIdentity,
  MasaSBTBase,
  MasaSession,
  MasaSoulName,
  MasaSSSBT,
  version,
} from "./modules";
import { getNetworkNameByChainId, MasaArweave, MasaClient } from "./utils";

export class Masa implements MasaInterface {
  // config
  public readonly config: MasaConfig;
  // clients
  public readonly arweave: MasaArweave;
  public readonly client: MasaClient;
  // contracts
  public readonly contracts: MasaContracts;
  // modules
  public readonly account: MasaAccount;
  public readonly session: MasaSession;
  public readonly identity: MasaIdentity;
  public readonly soulName: MasaSoulName;
  public readonly creditScore: MasaCreditScore;
  public readonly green: MasaGreen;
  // SBTs
  public readonly sbt: MasaSBTBase;
  public readonly asbt: MasaASBT;
  public readonly sssbt: MasaSSSBT;
  // Dynamic SBTs
  public readonly ["dynamic-sbt"]: MasaDynamicSBTBase;
  public readonly ["dynamic-sssbt"]: MasaDynamicSSSBT;

  public constructor({
    cookie,
    signer,
    apiUrl = "https://middleware.masa.finance",
    environment = "production",
    networkName = "ethereum",
    arweave = {
      host: "arweave.net",
      port: 443,
      protocol: "https",
    },
    contractOverrides,
    verbose = false,
    forceTransactions = false,
  }: MasaArgs) {
    // build config
    this.config = {
      apiUrl,
      environment,
      networkName,
      network: SupportedNetworks[networkName],
      signer,
      verbose,
      forceTransactions,
    };

    // masa client
    this.client = new MasaClient({
      masa: this,
      apiUrl,
      cookie,
    });

    // arweave client
    this.arweave = new MasaArweave(arweave, this.config);

    // masa contracts wrapper
    this.contracts = new MasaContracts({
      masa: this,
      contractOverrides,
    });
    // account + session
    this.account = new MasaAccount(this);
    this.session = new MasaSession(this);
    // identity
    this.identity = new MasaIdentity(this);
    // soul name
    this.soulName = new MasaSoulName(this);
    // credit score
    this.creditScore = new MasaCreditScore(this);
    // green
    this.green = new MasaGreen(this);
    // generic sbt handler
    this.sbt = new MasaSBTBase(this);
    // ASBT handler
    this.asbt = new MasaASBT(this);
    // SSSBT Handler
    this.sssbt = new MasaSSSBT(this);
    // dynamic sbt
    this["dynamic-sbt"] = new MasaDynamicSBTBase(this);
    this["dynamic-sssbt"] = new MasaDynamicSSSBT(this);
  }

  public utils = {
    version,
  };

  public static create = async (masaArgs: MasaArgs): Promise<Masa> => {
    const network = await masaArgs.signer.provider?.getNetwork();

    return new Masa({
      ...masaArgs,
      networkName: network
        ? getNetworkNameByChainId(network.chainId)
        : "ethereum",
    });
  };
}
