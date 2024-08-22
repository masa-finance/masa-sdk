import {
  MasaStaking,
  MasaStaking__factory,
} from "@masa-finance/masa-contracts-staking";
import { MasaToken, MasaToken__factory } from "@masa-finance/masa-token";
import { Connection, Keypair } from "@solana/web3.js";
import { Signer } from "ethers";

import { ContractInfo, ITokenContracts, NetworkName } from "../interface";
import { addresses } from "../networks";
import { loadContract } from "./load-contract";

export const loadTokenContracts = ({
  signer,
  networkName = "masa",
}: {
  signer:
    | Signer
    | {
        keypair: Keypair;
        connection: Connection;
      };
  networkName?: NetworkName;
}): ITokenContracts => {
  // MasaToken
  const MasaToken = loadContract<MasaToken & ContractInfo>({
    factory: new MasaToken__factory(),
    address: addresses[networkName]?.tokens?.MASA,
    signer,
  });

  // MasaStaking
  const MasaStaking = loadContract<MasaStaking & ContractInfo>({
    factory: new MasaStaking__factory(),
    address: addresses[networkName]?.MasaStakingAddress,
    signer,
  });

  return {
    MasaToken,
    MasaStaking,
  };
};
