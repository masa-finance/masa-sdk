import {
  type SoulboundCreditScore,
  SoulboundCreditScore__factory,
  type SoulboundGreen,
  SoulboundGreen__factory,
  SoulboundIdentity,
  SoulboundIdentity__factory,
  type SoulLinker,
  SoulLinker__factory,
  type SoulName,
  SoulName__factory,
  type SoulStore,
  SoulStore__factory,
} from "@masa-finance/masa-contracts-identity";
import { Connection, Keypair } from "@solana/web3.js";
import { Signer } from "ethers";

import { ContractInfo, IIdentityContracts, NetworkName } from "../interface";
import { addresses } from "../networks";
import { loadContract } from "./load-contract";

export const loadIdentityContracts = ({
  signer,
  networkName = "ethereum",
}: {
  signer:
    | Signer
    | {
        keypair: Keypair;
        connection: Connection;
      };
  networkName?: NetworkName;
}): IIdentityContracts => {
  // Identity
  const SoulboundIdentityContract = loadContract<
    SoulboundIdentity & ContractInfo
  >({
    factory: new SoulboundIdentity__factory(),
    address: addresses[networkName]?.SoulboundIdentityAddress,
    signer,
  });

  // Credit Score
  const SoulboundCreditScoreContract = loadContract<
    SoulboundCreditScore & ContractInfo
  >({
    factory: new SoulboundCreditScore__factory(),
    address: addresses[networkName]?.SoulboundCreditScoreAddress,
    signer,
  });

  // Soul Name
  const SoulNameContract = loadContract<SoulName & ContractInfo>({
    factory: new SoulName__factory(),
    address: addresses[networkName]?.SoulNameAddress,
    signer,
  });

  // Soul Linker
  const SoulLinkerContract = loadContract<SoulLinker & ContractInfo>({
    factory: new SoulLinker__factory(),
    address: addresses[networkName]?.SoulLinkerAddress,
    signer,
  });

  // Soul Store
  const SoulStoreContract = loadContract<SoulStore & ContractInfo>({
    factory: new SoulStore__factory(),
    address: addresses[networkName]?.SoulStoreAddress,
    signer,
  });

  // Green
  const SoulboundGreenContract = loadContract<SoulboundGreen & ContractInfo>({
    factory: new SoulboundGreen__factory(),
    address: addresses[networkName]?.SoulboundGreenAddress,
    signer,
  });

  return {
    SoulboundIdentityContract,
    SoulboundCreditScoreContract,
    SoulNameContract,
    SoulLinkerContract,
    SoulStoreContract,
    SoulboundGreenContract,
  };
};
