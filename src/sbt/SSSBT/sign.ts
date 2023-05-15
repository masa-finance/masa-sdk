import Masa from "../../masa";
import {
  MasaSBTSelfSovereign,
  ReferenceSBTSelfSovereign,
} from "@masa-finance/masa-contracts-identity";
import { Contract } from "ethers";

import { abi } from "@masa-finance/masa-contracts-identity/artifacts/contracts/reference/ReferenceSBTAuthority.sol/ReferenceSBTAuthority.json";

export const signSSSBT = async (
  masa: Masa,
  sbtContract: MasaSBTSelfSovereign,
  receiver: string
) => {
  const [name, symbol] = await Promise.all([
    sbtContract.name(),
    sbtContract.symbol(),
  ]);

  console.log(`Signing SSSBT on: '${masa.config.networkName}'`);
  console.log(`Contract Name: '${name}'`);
  console.log(`Contract Symbol: '${symbol}'`);
  console.log(`Contract Address: '${sbtContract.address}'`);
  console.log(`To receiver: '${receiver}'`);

  const sssbt: ReferenceSBTSelfSovereign = (await new Contract(
    sbtContract.address,
    abi,
    masa.config.wallet
  ).deployed()) as ReferenceSBTSelfSovereign;

  const signatureDate = Date.now();

  const types = {
    Mint: [
      { name: "to", type: "address" },
      { name: "authorityAddress", type: "address" },
      { name: "signatureDate", type: "uint256" },
    ],
  };

  // fill the collection with data
  const value: {
    to: string;
    authorityAddress: string;
    signatureDate: number;
  } = {
    to: receiver,
    authorityAddress: await masa.config.wallet.getAddress(),
    signatureDate,
  };

  const { sign } = await masa.contracts.sbt.attach<ReferenceSBTSelfSovereign>(
    sssbt
  );

  // sign to create a signature
  const signResult = await sign("ReferenceSBTSelfSovereign", types, value);
  if (!signResult) return;

  const { signature, authorityAddress } = signResult;

  if (masa.config.verbose) {
    console.info({ signature, authorityAddress, signatureDate });
  }

  return {
    authorityAddress,
    signatureDate,
    signature,
  };
};
