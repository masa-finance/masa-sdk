import {
  SoulboundIdentity__factory,
  SoulboundCreditReport__factory,
  SoulName__factory,
  SoulLinker__factory,
  SoulStore__factory,
  Soulbound2FA__factory,
} from "@masa-finance/masa-contracts-identity";
import { ethers } from "ethers";
import { IIdentityContracts } from "../interface";
import { addresses } from "./addresses";

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

  const Soulbound2FA = Soulbound2FA__factory.connect(
    addresses[network].SoulStoreAddress,
    p
  );

  return {
    SoulboundIdentityContract,
    SoulboundCreditReportContract,
    SoulNameContract,
    SoulLinkerContract,
    SoulStoreContract,
    Soulbound2FA,
  };
};
