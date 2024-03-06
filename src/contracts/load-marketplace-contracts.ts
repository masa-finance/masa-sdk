import {
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
  const DataStaking = loadContract<DataStaking & ContractInfo>({
    factory: new DataStaking__factory(),
    address: addresses[networkName]?.DataStaking,
    signer,
  });

  return {
    DataStaking,
  };
};
