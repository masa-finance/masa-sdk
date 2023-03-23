import {
  SoulboundCreditScore,
  SoulboundCreditScore__factory,
  SoulboundGreen,
  SoulboundGreen__factory,
  SoulboundIdentity,
  SoulboundIdentity__factory,
  SoulLinker,
  SoulLinker__factory,
  SoulName,
  SoulName__factory,
  SoulStore,
  SoulStore__factory,
} from "@masa-finance/masa-contracts-identity";
import { constants, providers } from "ethers";
import { IIdentityContracts, NetworkName } from "../interface";
import { addresses } from "./addresses";

export interface LoadContractArgs {
  provider?: providers.Provider;
  networkName?: NetworkName;
}

export const loadIdentityContracts = ({
  provider,
  networkName = "ethereum",
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

  const SoulboundIdentityContract: SoulboundIdentity =
    SoulboundIdentity__factory.connect(
      addresses[networkName]?.SoulboundIdentityAddress || constants.AddressZero,
      loadedProvider
    );

  const SoulboundCreditScoreContract: SoulboundCreditScore =
    SoulboundCreditScore__factory.connect(
      addresses[networkName]?.SoulboundCreditScoreAddress ||
        constants.AddressZero,
      loadedProvider
    );

  const SoulNameContract: SoulName = SoulName__factory.connect(
    addresses[networkName]?.SoulNameAddress || constants.AddressZero,
    loadedProvider
  );

  const SoulLinkerContract: SoulLinker = SoulLinker__factory.connect(
    addresses[networkName]?.SoulLinkerAddress || constants.AddressZero,
    loadedProvider
  );

  const SoulStoreContract: SoulStore = SoulStore__factory.connect(
    addresses[networkName]?.SoulStoreAddress || constants.AddressZero,
    loadedProvider
  );

  const SoulboundGreenContract: SoulboundGreen =
    SoulboundGreen__factory.connect(
      // this might be empty
      addresses[networkName]?.SoulboundGreenAddress || constants.AddressZero,
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
