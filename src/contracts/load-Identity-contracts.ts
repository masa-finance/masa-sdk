import {
  SoulboundCreditScore__factory,
  SoulboundGreen__factory,
  SoulboundIdentity__factory,
  SoulLinker__factory,
  SoulName__factory,
  SoulStore__factory,
} from "@masa-finance/masa-contracts-identity";
import { ethers } from "ethers";
import { IIdentityContracts, NetworkName } from "../interface";
import { addresses } from "./addresses";

export interface LoadContractArgs {
  provider?: ethers.providers.Provider;
  network?: NetworkName;
}

export const loadIdentityContracts = ({
  provider,
  network = "goerli",
}: LoadContractArgs): IIdentityContracts => {
  if (!addresses[network]) {
    throw new Error(`Network ${network} not supported!`);
  }

  const p =
    // take provider as is if supplied
    provider ||
    // or try to load from the browser
    new ethers.providers.Web3Provider(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      window.ethereum
    );

  const SoulboundIdentityContract = SoulboundIdentity__factory.connect(
    addresses[network]?.SoulboundIdentityAddress ||
      ethers.constants.AddressZero,
    p
  );

  const SoulboundCreditScoreContract = SoulboundCreditScore__factory.connect(
    addresses[network]?.SoulboundCreditScoreAddress ||
      ethers.constants.AddressZero,
    p
  );

  const SoulNameContract = SoulName__factory.connect(
    addresses[network]?.SoulNameAddress || ethers.constants.AddressZero,
    p
  );

  const SoulLinkerContract = SoulLinker__factory.connect(
    addresses[network]?.SoulLinkerAddress || ethers.constants.AddressZero,
    p
  );

  const SoulStoreContract = SoulStore__factory.connect(
    addresses[network]?.SoulStoreAddress || ethers.constants.AddressZero,
    p
  );

  const SoulboundGreenContract = SoulboundGreen__factory.connect(
    // this might be empty
    addresses[network]?.SoulboundGreenAddress || ethers.constants.AddressZero,
    p
  );

  return {
    SoulboundIdentityContract,
    SoulboundCreditScoreContract,
    SoulNameContract,
    SoulLinkerContract,
    SoulStoreContract,
    SoulboundGreenContract,
  };
};
