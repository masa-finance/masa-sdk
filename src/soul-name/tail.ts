import Masa from "../masa";
import { SoulNameDetails } from "../interface";
import { printSoulName } from "./helpers";
import { constants } from "ethers";
import { loadSoulNameByTokenId } from "./load";
import { TransferEvent } from "@masa-finance/masa-contracts-identity/dist/typechain/contracts/SoulName";

export const tailSoulNames = async (
  masa: Masa,
  limit: number = 5
): Promise<SoulNameDetails[]> => {
  const soulNameMintEventsFilter =
    masa.contracts.instances.SoulNameContract.filters.Transfer(
      constants.AddressZero
    );

  const { number } =
    (await masa.config.wallet.provider?.getBlock("latest")) || {};

  const lastBlockNumber = await number;
  const soulNameMintEvents = [];

  const offset = 2_500;
  let x = 0;

  do {
    const fromBlock = lastBlockNumber ? lastBlockNumber - offset * (x + 1) : 0;
    const toBlock = lastBlockNumber ? lastBlockNumber - offset * x : "latest";

    soulNameMintEvents.push(
      ...(await masa.contracts.instances.SoulNameContract.queryFilter(
        soulNameMintEventsFilter,
        fromBlock,
        toBlock
      ))
    );
    x++;
  } while (soulNameMintEvents.length <= limit);

  const soulNames = (
    await Promise.all(
      soulNameMintEvents
        .slice(soulNameMintEvents.length - limit)
        .map((soulNameMintEvent: TransferEvent) =>
          loadSoulNameByTokenId(masa, soulNameMintEvent.args.tokenId)
        )
    )
  ).filter((soulNameDetail: SoulNameDetails | undefined) => !!soulNameDetail);

  return soulNames as SoulNameDetails[];
};

export const tailSoulNamesAndPrint = async (
  masa: Masa,
  limit: number = 5
): Promise<SoulNameDetails[]> => {
  const soulNames = await tailSoulNames(masa, limit);

  if (soulNames.length > 0) {
    let index = 0;
    for (const soulName of soulNames) {
      printSoulName(soulName, index, masa.config.verbose);
      index++;
    }
  } else {
    console.error("No soulnames found!");
  }

  return soulNames;
};
