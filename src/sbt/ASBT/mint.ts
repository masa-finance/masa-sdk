import Masa from "../../masa";
import {
  MasaSBTAuthority,
  MasaSBTSelfSovereign,
} from "@masa-finance/masa-contracts-identity";
import { Contract } from "ethers";

import { abi } from "./ASBT";
import { Messages } from "../../utils";
import { LogDescription } from "@ethersproject/abi";

export const mintASBT = async (
  masa: Masa,
  sbtContract: MasaSBTSelfSovereign | MasaSBTAuthority,
  receiver: string
) => {
  const [name, symbol] = await Promise.all([
    sbtContract.name(),
    sbtContract.symbol(),
  ]);

  console.log("Minting SBT on:");
  console.log(`Contract Name: '${name}'`);
  console.log(`Contract Symbol: '${symbol}'`);
  console.log(`Contract Address: '${sbtContract.address}'`);
  console.log(`To receiver: '${receiver}'`);

  const asbt = await new Contract(
    sbtContract.address,
    abi,
    masa.config.wallet
  ).deployed();

  const { wait, hash } = await asbt.mint(receiver);
  console.log(Messages.WaitingToFinalize(hash));

  const { logs } = await wait();

  const parsedLogs = masa.contracts.parseLogs(logs, [asbt]);

  const mintEvent = parsedLogs.find(
    (log: LogDescription) => log.name === "Mint"
  );

  if (mintEvent) {
    const { args } = mintEvent;
    console.log(
      `Minted to token with ID: ${args._tokenId} receiver '${args._owner}'`
    );
  }
};
