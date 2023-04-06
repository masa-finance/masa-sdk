import { ContractFactory } from "ethers";
import * as ASBT from "./ASBT";
import Masa from "../../masa";
import { Messages } from "../../utils";

export const deployASBT = async (
  masa: Masa,
  name: string,
  symbol: string,
  baseTokenUri: string,
  adminAddress?: string
): Promise<string | undefined> => {
  adminAddress = adminAddress || (await masa.config.wallet.getAddress());

  console.log(`Deploying ASBT to network '${masa.config.networkName}'`);

  const factory: ContractFactory = new ContractFactory(
    ASBT.abi,
    ASBT.bytecode,
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
    } = await factory.deploy(adminAddress, name, symbol, baseTokenUri);

    console.log(Messages.WaitingToFinalize(hash));

    await wait();

    console.log(
      `ASBT successfully deployed to '${masa.config.networkName}' with contract address: '${address}'`
    );

    return address;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("ASBT deployment failed!", error.message);
    }
  }
};
