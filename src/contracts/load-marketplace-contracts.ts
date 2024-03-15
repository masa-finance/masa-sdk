import {
  DataPointsMulti,
  DataPointsMulti__factory,
  DataStaking,
  DataStaking__factory,
} from "@masa-finance/masa-contracts-marketplace";
import { Signer } from "ethers";

import { ContractInfo, IMarketplaceContracts, NetworkName } from "../interface";
import { addresses } from "../networks";
import { loadContract } from "./load-contract";

export const loadMarketplaceContracts = ({
  signer,
  networkName = "ethereum",
}: {
  signer: Signer;
  networkName?: NetworkName;
}): IMarketplaceContracts => {
  // Data Staking
  const DataStakingContract = loadContract<DataStaking & ContractInfo>({
    factory: new DataStaking__factory(),
    address: addresses[networkName]?.DataStakingAddress,
    signer,
  });

  // DataPoints Multi
  const DataPointsMultiContract = loadContract<DataPointsMulti & ContractInfo>({
    factory: new DataPointsMulti__factory(),
    address: addresses[networkName]?.DataPointsMultiAddress,
    signer,
  });

  return {
    DataStakingContract,
    DataPointsMultiContract,
  };
};
