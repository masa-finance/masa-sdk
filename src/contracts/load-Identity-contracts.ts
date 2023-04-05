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
import { ContractInfo, IIdentityContracts, NetworkName } from "../interface";
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

  const SoulboundIdentityContract: SoulboundIdentity & ContractInfo =
    SoulboundIdentity__factory.connect(
      addresses[networkName]?.SoulboundIdentityAddress || constants.AddressZero,
      loadedProvider
    );
  SoulboundIdentityContract.hasAddress =
    !!addresses[networkName]?.SoulboundIdentityAddress;

  const SoulboundCreditScoreContract: SoulboundCreditScore & ContractInfo =
    SoulboundCreditScore__factory.connect(
      addresses[networkName]?.SoulboundCreditScoreAddress ||
        constants.AddressZero,
      loadedProvider
    );
  SoulboundCreditScoreContract.hasAddress =
    !!addresses[networkName]?.SoulboundCreditScoreAddress;

  const SoulNameContract: SoulName & ContractInfo = SoulName__factory.connect(
    addresses[networkName]?.SoulNameAddress || constants.AddressZero,
    loadedProvider
  );
  SoulNameContract.hasAddress = !!addresses[networkName]?.SoulNameAddress;

  const SoulLinkerContract: SoulLinker & ContractInfo =
    SoulLinker__factory.connect(
      addresses[networkName]?.SoulLinkerAddress || constants.AddressZero,
      loadedProvider
    );
  SoulLinkerContract.hasAddress = !!addresses[networkName]?.SoulLinkerAddress;

  const SoulStoreContract: SoulStore & ContractInfo =
    SoulStore__factory.connect(
      addresses[networkName]?.SoulStoreAddress || constants.AddressZero,
      loadedProvider
    );
  SoulStoreContract.hasAddress = !!addresses[networkName]?.SoulStoreAddress;

  const SoulboundGreenContract: SoulboundGreen & ContractInfo =
    SoulboundGreen__factory.connect(
      // this might be empty
      addresses[networkName]?.SoulboundGreenAddress || constants.AddressZero,
      loadedProvider
    );
  SoulboundGreenContract.hasAddress =
    !!addresses[networkName]?.SoulboundGreenAddress;

  return {
    SoulboundIdentityContract,
    SoulboundCreditScoreContract,
    SoulNameContract,
    SoulLinkerContract,
    SoulStoreContract,
    SoulboundGreenContract,
  };
};
