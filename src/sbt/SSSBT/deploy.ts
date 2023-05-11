import { ContractFactory } from "ethers";
import {
  abi,
  bytecode,
} from "@masa-finance/masa-contracts-identity/artifacts/contracts/reference/ReferenceSBTSelfSovereign.sol/ReferenceSBTSelfSovereign.json";
import Masa from "../../masa";
import { Messages } from "../../utils";

export const deploySSSBT = async (
  masa: Masa,
  name: string,
  symbol: string,
  baseTokenUri: string,
  adminAddress?: string
): Promise<string | undefined> => {
  adminAddress = adminAddress || (await masa.config.wallet.getAddress());

  console.log(`Deploying SSSBT to network '${masa.config.networkName}'`);

  const factory: ContractFactory = new ContractFactory(
    abi,
    bytecode,
    masa.config.wallet
  );

  if (masa.config.verbose) {
    console.info({
      adminAddress,
      name,
      symbol,
      baseTokenUri,
    });
  }

  try {
    const {
      deployTransaction: { wait, hash },
      address,
    } = await factory.deploy(
      adminAddress,
      name,
      symbol,
      baseTokenUri,
      masa.contracts.instances.SoulboundIdentityContract.address
    );

    console.log(Messages.WaitingToFinalize(hash));

    await wait();

    console.log(
      `SSSBT successfully deployed to '${masa.config.networkName}' with contract address: '${address}'`
    );

    return address;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("SSSBT deployment failed!", error.message);
    }
  }
};
