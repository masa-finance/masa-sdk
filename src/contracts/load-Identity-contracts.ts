import {
  Soulbound2FA__factory,
  SoulboundCreditScore__factory,
  SoulboundIdentity__factory,
  SoulLinker__factory,
  SoulName__factory,
  SoulStore__factory,
} from "@masa-finance/masa-contracts-identity";
import { ethers } from "ethers";
import { IIdentityContracts } from "../interface";
import { addresses } from "./addresses";

export interface LoadContractArgs {
  provider?: ethers.providers.Provider;
  network?: string;
}

export const loadIdentityContracts = ({
  provider,
  network = "goerli",
}: LoadContractArgs): IIdentityContracts => {
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
    addresses[network].SoulboundIdentityAddress,
    p
  );

  const SoulboundCreditScoreContract = SoulboundCreditScore__factory.connect(
    addresses[network].SoulboundCreditScoreAddress,
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

  const Soulbound2FAContract = Soulbound2FA__factory.connect(
    // this might be empty
    addresses[network].Soulbound2FAAddress || ethers.constants.AddressZero,
    p
  );

  return {
    SoulboundIdentityContract,
    SoulboundCreditScoreContract,
    SoulNameContract,
    SoulLinkerContract,
    SoulStoreContract,
    Soulbound2FAContract,
  };
};
