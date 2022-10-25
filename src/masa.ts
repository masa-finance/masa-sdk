import { BigNumber, ethers } from "ethers";
import { logout } from "./session/logout";
import { checkLogin } from "./session/check-login";
import { version } from "./helpers/version";
import { login } from "./session/login";
import { addresses, loadIdentityContracts } from "./contracts";
import MasaClient from "./utils/clients/middleware";
import { arweave } from "./utils/clients/arweave";
import { getBalances } from "./account/getBalances";
import { createRandomWallet } from "./account/createRandomWallet";
import { patchMetadataUrl } from "./helpers/patchMetadataUrl";
import { burnCreditScore } from "./credit-report/burn";
import {
  listCreditReports,
  loadCreditScoresByIdentityId,
} from "./credit-report/list";
import { burnIdentity } from "./identity/burn";
import { loadIdentity } from "./identity/load";
import { ContractService, PaymentMethod } from "./contracts/contract-service";
import { createCreditScore } from "./credit-report/create";
import { createSoulName } from "./soul-name/create";
import { createIdentity } from "./identity/create";
import { showIdentity } from "./identity/show";
import { burnSoulName } from "./soul-name/burn";
import { listSoulnames, loadSoulNamesByIdentityId } from "./soul-name/list";

export interface MasaArgs {
  cookie?: string;
  wallet: ethers.Signer;
  apiUrl: string;
  environment: string;
  arweave: {
    host: string;
    port: number;
    protocol: string;
    logging: boolean;
  };
}

export interface MasaConfig {
  apiUrl: string;
  environment: string;
  network: string;
  wallet: ethers.Signer;
}

export default class Masa {
  public readonly client: MasaClient;
  public readonly arweaveClient;

  constructor({
    cookie,
    wallet,
    apiUrl,
    environment,
    arweave: { host, port, protocol, logging },
  }: MasaArgs) {
    this.client = new MasaClient({
      apiUrl,
      cookie,
    });

    this.arweaveClient = arweave({
      host,
      port,
      protocol,
      logging,
    });

    this.config.wallet = wallet;
    this.config.apiUrl = apiUrl;
    this.config.environment = environment;
  }

  public config: MasaConfig = {
    apiUrl: "https://dev.middleware.masa.finance",
    environment: "dev",
    network: "goerli",
    wallet: createRandomWallet(),
  };

  session = {
    checkLogin: () => checkLogin(this),
    sessionLogout: () => this.client.sessionLogout(),
    login: () => login(this),
    logout: () => logout(this),
  };

  identity = {
    create: (
      soulName: string,
      duration: number,
      paymentMethod: PaymentMethod
    ) => createIdentity(this, soulName, duration, paymentMethod),
    load: (address?: string) => loadIdentity(this, address),
    burn: () => burnIdentity(this),
    show: (address?: string) => showIdentity(this, address),
  };

  account = {
    getBalances: (address: string) => getBalances(this, address),
  };

  soulNames = {
    list: (address?: string) => listSoulnames(this, address),
    loadSoulNamesByIdentityId: (identityId: BigNumber) =>
      loadSoulNamesByIdentityId(this, identityId),
    create: (
      soulName: string,
      duration: number,
      paymentMethod: PaymentMethod
    ) => createSoulName(this, soulName, duration, paymentMethod),
    burn: (soulName: string) => burnSoulName(this, soulName),
  };

  metadata = {
    metadataStore: (soulName: string) => this.client.metadataStore(soulName),
    getMetadata: (url: string) => this.client.getMetadata(url),
    patchMetadataUrl: (tokenUri: string) => patchMetadataUrl(this, tokenUri),
  };

  creditScore = {
    mint: (address: string, signature: string) =>
      this.client.creditScoreMint(address, signature),
    create: () => createCreditScore(this),
    burn: (creditReportId: number) => burnCreditScore(this, creditReportId),
    list: (address?: string) => listCreditReports(this, address),
    load: (identityId: BigNumber) =>
      loadCreditScoresByIdentityId(this, identityId),
  };

  utils = {
    version,
  };

  contracts = {
    service: new ContractService(this),
    loadIdentityContracts: () =>
      loadIdentityContracts({
        provider: this.config.wallet.provider,
        network: this.config.network,
      }),
    addresses,
  };
}
