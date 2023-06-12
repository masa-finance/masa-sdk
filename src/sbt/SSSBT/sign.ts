import { ReferenceSBTSelfSovereign } from "@masa-finance/masa-contracts-identity";

import type { MasaInterface } from "../../interface";

export const signSSSBT = async (
  masa: MasaInterface,
  contract: ReferenceSBTSelfSovereign,
  receiver: string
) => {
  const [name, symbol] = await Promise.all([
    contract.name(),
    contract.symbol(),
  ]);

  console.log(`Signing SSSBT on: '${masa.config.networkName}'`);
  console.log(`Contract Name: '${name}'`);
  console.log(`Contract Symbol: '${symbol}'`);
  console.log(`Contract Address: '${contract.address}'`);
  console.log(`To receiver: '${receiver}'`);

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
    authorityAddress: await masa.config.signer.getAddress(),
    signatureDate,
  };

  const { sign } = await masa.contracts.sssbt.attach(contract);

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
