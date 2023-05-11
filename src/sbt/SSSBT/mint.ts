import Masa from "../../masa";
import {
  ReferenceSBTAuthority,
  ReferenceSBTSelfSovereign,
} from "@masa-finance/masa-contracts-identity";
import { constants, Contract } from "ethers";

import { abi } from "@masa-finance/masa-contracts-identity/artifacts/contracts/reference/ReferenceSBTAuthority.sol/ReferenceSBTAuthority.json";
import { Messages } from "../../utils";
import { LogDescription } from "@ethersproject/abi";

export const mintSSSBT = async (
  masa: Masa,
  sbtContract: ReferenceSBTAuthority,
  receiver: string,
  authorityAddress: string,
  signatureDate: number,
  signature: string
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

  const sssbt: ReferenceSBTSelfSovereign = (await new Contract(
    sbtContract.address,
    abi,
    masa.config.wallet
  ).deployed()) as ReferenceSBTSelfSovereign;

  const { wait, hash } = await sssbt[
    "mint(address,address,address,uint256,bytes)"
  ](
    constants.AddressZero,
    receiver,
    authorityAddress,
    signatureDate,
    signature
  );
  console.log(Messages.WaitingToFinalize(hash));

  const { logs } = await wait();

  const parsedLogs = masa.contracts.parseLogs(logs, [sssbt]);

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
