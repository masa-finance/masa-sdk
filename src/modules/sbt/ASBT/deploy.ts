import {
  abi,
  bytecode,
} from "@masa-finance/masa-contracts-identity/artifacts/contracts/reference/ReferenceSBTAuthority.sol/ReferenceSBTAuthority.json";
import { PaymentGateway } from "@masa-finance/masa-contracts-identity/dist/typechain/contracts/reference/ReferenceSBTAuthority";
import { constants, ContractFactory } from "ethers";

import { Messages } from "../../../collections";
import type { DeployResult, MasaInterface } from "../../../interface";
import PaymentParamsStruct = PaymentGateway.PaymentParamsStruct;

export const deployASBT = async (
  masa: MasaInterface,
  name: string,
  symbol: string,
  baseTokenUri: string,
  limit: number = 1,
  adminAddress?: string
): Promise<DeployResult<PaymentParamsStruct> | undefined> => {
  let result: DeployResult<PaymentParamsStruct> | undefined;

  adminAddress = adminAddress || (await masa.config.signer.getAddress());

  console.log(
    `Deploying ASBT contract to network '${masa.config.networkName}'`
  );

  const contractFactory: ContractFactory = new ContractFactory(
    abi,
    bytecode,
    masa.config.signer
  );

  const deployASBTArguments: [
    string, // address admin
    string, // string name
    string, // string symbol
    string, // string baseTokenURI
    string, // address soulboundIdentity
    PaymentParamsStruct, // PaymentParams paymentParams,
    number // number _maxSBTToMint
  ] = [
    adminAddress,
    name,
    symbol,
    baseTokenUri,
    masa.contracts.instances.SoulboundIdentityContract.address,
    {
      swapRouter: constants.AddressZero,
      wrappedNativeToken: constants.AddressZero,
      stableCoin: constants.AddressZero,
      masaToken: constants.AddressZero,
      projectFeeReceiver: constants.AddressZero,
      protocolFeeReceiver: constants.AddressZero,
      protocolFeeAmount: 0,
      protocolFeePercent: 0,
    },
    limit,
  ];

  const abiEncodedDeployASBTArguments =
    contractFactory.interface.encodeDeploy(deployASBTArguments);
  if (masa.config.verbose) {
    console.dir(
      {
        deployASBTArguments,
        abiEncodedDeployASBTArguments,
      },
      { depth: null }
    );
  }

  try {
    const {
      deployTransaction: { wait, hash },
      address,
    } = await contractFactory.deploy(...deployASBTArguments);
    console.log(
      Messages.WaitingToFinalize(
        hash,
        masa.config.network?.blockExplorerUrls?.[0]
      )
    );

    await wait();

    console.log(
      `ASBT successfully deployed to '${masa.config.networkName}' with contract address: '${address}'`
    );

    result = {
      address,
      constructorArguments: deployASBTArguments,
      abiEncodedConstructorArguments: abiEncodedDeployASBTArguments,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("ASBT deployment failed!", error.message);
    }
  }

  return result;
};
