import {
  SoulboundCreditScore__factory,
  SoulboundGreen__factory,
  SoulboundIdentity__factory,
  SoulLinker__factory,
  SoulName__factory,
  SoulStore__factory,
} from "@masa-finance/masa-contracts-identity";
import { constants, providers } from "ethers";
import { IIdentityContracts, NetworkName } from "../interface";
import { addresses } from "./addresses";

export interface LoadContractArgs {
  provider?: providers.Provider;
  network?: NetworkName;
}

export const loadIdentityContracts = ({
  provider,
  network = "ethereum",
}: LoadContractArgs): IIdentityContracts => {
  const loadedProvider =
    // take provider as is if supplied
    provider ||
    // or try to load from the browser
    new providers.Web3Provider(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      window.ethereum
    );

  const SoulboundIdentityContract = SoulboundIdentity__factory.connect(
    addresses[network]?.SoulboundIdentityAddress || constants.AddressZero,
    loadedProvider
  );

  const SoulboundCreditScoreContract = SoulboundCreditScore__factory.connect(
    addresses[network]?.SoulboundCreditScoreAddress || constants.AddressZero,
    loadedProvider
  );

  const SoulNameContract = SoulName__factory.connect(
    addresses[network]?.SoulNameAddress || constants.AddressZero,
    loadedProvider
  );

  const SoulLinkerContract = SoulLinker__factory.connect(
    addresses[network]?.SoulLinkerAddress || constants.AddressZero,
    loadedProvider
  );

  const SoulStoreContract = SoulStore__factory.connect(
    addresses[network]?.SoulStoreAddress || constants.AddressZero,
    loadedProvider
  );

  const SoulboundGreenContract = SoulboundGreen__factory.connect(
    // this might be empty
    addresses[network]?.SoulboundGreenAddress || constants.AddressZero,
    loadedProvider
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
