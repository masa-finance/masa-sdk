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
  MasaMarketplace,
  MasaSBTBase,
  MasaSession,
  MasaSoulName,
  MasaSSSBT,
  MasaToken,
  version,
} from "./modules";
import {
  getNetworkNameByChainId,
  isSigner,
  MasaArweave,
  MasaClient,
} from "./utils";

export class Masa implements MasaInterface {
  // config
  readonly config: MasaConfig;
  // clients
  readonly arweave: MasaArweave;
  readonly client: MasaClient;
  // contracts
  readonly contracts: MasaContracts;
  // modules
  readonly account: MasaAccount;
  readonly session: MasaSession;
  readonly identity: MasaIdentity;
  readonly soulName: MasaSoulName;
  readonly creditScore: MasaCreditScore;
  readonly green: MasaGreen;
  // SBTs
  readonly sbt: MasaSBTBase;
  readonly asbt: MasaASBT;
  readonly sssbt: MasaSSSBT;
  // token
  readonly token: MasaToken;
  // marketplace
  readonly marketplace: MasaMarketplace;
  // Dynamic SBTs
  readonly ["dynamic-sbt"]: MasaDynamicSBTBase;
  readonly ["dynamic-sssbt"]: MasaDynamicSSSBT;

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
    // token
    this.token = new MasaToken(this);
    // marketplace
    this.marketplace = new MasaMarketplace(this);
    // dynamic sbt
    this["dynamic-sbt"] = new MasaDynamicSBTBase(this);
    this["dynamic-sssbt"] = new MasaDynamicSSSBT(this);
  }

  utils = {
    version,
  };

  public static create = async (masaArgs: MasaArgs) => {
    const network = isSigner(masaArgs.signer)
      ? await masaArgs.signer.provider?.getNetwork()
      : undefined;

    return new Masa({
      ...masaArgs,
      networkName: network
        ? getNetworkNameByChainId(network.chainId)
        : "ethereum",
    });
  };
}
