import type {
  SoulboundCreditScore,
  SoulboundGreen,
  SoulboundIdentity,
  SoulLinker,
  SoulName,
  SoulStore,
} from "@masa-finance/masa-contracts-identity";
import {
  SoulboundCreditScore__factory,
  SoulboundGreen__factory,
  SoulboundIdentity__factory,
  SoulLinker__factory,
  SoulName__factory,
  SoulStore__factory,
} from "@masa-finance/masa-contracts-identity";
import { constants, Signer } from "ethers";

import type { ContractInfo, IIdentityContracts } from "../interface";
import { NetworkName } from "../interface";
import { addresses } from "../networks";

export interface LoadContractArgs {
  signer: Signer;
  networkName?: NetworkName;
}

export const loadIdentityContracts = ({
  signer,
  networkName = "ethereum",
}: LoadContractArgs): IIdentityContracts => {
  const SoulboundIdentityContract: SoulboundIdentity & ContractInfo =
    SoulboundIdentity__factory.connect(
      addresses[networkName]?.SoulboundIdentityAddress || constants.AddressZero,
      signer,
    );
  SoulboundIdentityContract.hasAddress = Boolean(
    addresses[networkName]?.SoulboundIdentityAddress,
  );

  const SoulboundCreditScoreContract: SoulboundCreditScore & ContractInfo =
    SoulboundCreditScore__factory.connect(
      addresses[networkName]?.SoulboundCreditScoreAddress ||
        constants.AddressZero,
      signer,
    );
  SoulboundCreditScoreContract.hasAddress = Boolean(
    addresses[networkName]?.SoulboundCreditScoreAddress,
  );

  const SoulNameContract: SoulName & ContractInfo = SoulName__factory.connect(
    addresses[networkName]?.SoulNameAddress || constants.AddressZero,
    signer,
  );
  SoulNameContract.hasAddress = Boolean(
    addresses[networkName]?.SoulNameAddress,
  );

  const SoulLinkerContract: SoulLinker & ContractInfo =
    SoulLinker__factory.connect(
      addresses[networkName]?.SoulLinkerAddress || constants.AddressZero,
      signer,
    );
  SoulLinkerContract.hasAddress = Boolean(
    addresses[networkName]?.SoulLinkerAddress,
  );

  const SoulStoreContract: SoulStore & ContractInfo =
    SoulStore__factory.connect(
      addresses[networkName]?.SoulStoreAddress || constants.AddressZero,
      signer,
    );
  SoulStoreContract.hasAddress = Boolean(
    addresses[networkName]?.SoulStoreAddress,
  );

  const SoulboundGreenContract: SoulboundGreen & ContractInfo =
    SoulboundGreen__factory.connect(
      // this might be empty
      addresses[networkName]?.SoulboundGreenAddress || constants.AddressZero,
      signer,
    );
  SoulboundGreenContract.hasAddress = Boolean(
    addresses[networkName]?.SoulboundGreenAddress,
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
