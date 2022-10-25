import {
  SoulboundIdentity__factory,
  SoulboundCreditReport__factory,
  SoulName__factory,
  SoulLinker__factory,
  SoulStore__factory,
} from "@masa-finance/masa-contracts-identity";
import { ethers } from "ethers";
import * as goerli from "./goerli";
import { IIdentityContracts } from "../interface";

export interface Addresses {
  [index: string]: {
    MASA: string;
    USDC: string;
    WETH: string;
    SoulboundIdentityAddress: string;
    SoulboundCreditReportAddress: string;
    SoulNameAddress: string;
    SoulStoreAddress: string;
    SoulLinkerAddress: string;
  };
}

export const addresses: Addresses = {
  goerli,
};

export interface LoadContractArgs {
  provider?: ethers.providers.Provider;
  network?: string;
}

export const loadIdentityContracts = async ({
  provider,
  network = "goerli",
}: LoadContractArgs): Promise<IIdentityContracts> => {
  const p =
    // take provider as is if supplied
    provider ||
    // or try to load from the browser
    new ethers.providers.Web3Provider(
      // @ts-ignore
      window.ethereum
    );

  const SoulboundIdentityContract = SoulboundIdentity__factory.connect(
    addresses[network].SoulboundIdentityAddress,
    p
  );

  const SoulboundCreditReportContract = SoulboundCreditReport__factory.connect(
    addresses[network].SoulboundCreditReportAddress,
    p
  );

  const SoulNameContract = SoulName__factory.connect(
    addresses[network].SoulNameAddress,
    p
  );

  const SoulLinkerContract = SoulLinker__factory.connect(
    addresses[network].SoulLinkerAddress,
    p
  );

  const SoulStoreContract = SoulStore__factory.connect(
    addresses[network].SoulStoreAddress,
    p
  );

  return {
    SoulboundIdentityContract,
    SoulboundCreditReportContract,
    SoulNameContract,
    SoulLinkerContract,
    SoulStoreContract,
  };
};
