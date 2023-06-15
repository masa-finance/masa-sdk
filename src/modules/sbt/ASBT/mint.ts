import type { ReferenceSBTAuthority } from "@masa-finance/masa-contracts-identity";

import type { MasaInterface, PaymentMethod } from "../../../interface";

/**
 *
 * @param masa
 * @param sbtContract
 * @param receiver
 * @param paymentMethod
 */
export const mintASBT = async (
  masa: MasaInterface,
  sbtContract: ReferenceSBTAuthority,
  receiver: string,
  paymentMethod: PaymentMethod = "ETH"
): Promise<boolean> => {
  const [name, symbol] = await Promise.all([
    sbtContract.name(),
    sbtContract.symbol(),
  ]);

  console.log(`Minting ASBT on: '${masa.config.networkName}'`);
  console.log(`Contract Name: '${name}'`);
  console.log(`Contract Symbol: '${symbol}'`);
  console.log(`Contract Address: '${sbtContract.address}'`);
  console.log(`To receiver: '${receiver}'`);

  const { mint } = await masa.contracts.asbt.attach(sbtContract);

  return mint(paymentMethod, receiver);
};

/**
 *
 * @param masa
 * @param sbtContract
 * @param receivers
 * @param paymentMethod
 */
export const bulkMintASBT = async (
  masa: MasaInterface,
  sbtContract: ReferenceSBTAuthority,
  receivers: string[],
  paymentMethod: PaymentMethod = "ETH"
): Promise<boolean[]> => {
  const [name, symbol] = await Promise.all([
    sbtContract.name(),
    sbtContract.symbol(),
  ]);

  console.log(`Bulk Minting ASBT on: '${masa.config.networkName}'`);
  console.log(`Contract Name: '${name}'`);
  console.log(`Contract Symbol: '${symbol}'`);
  console.log(`Contract Address: '${sbtContract.address}'`);
  console.log(`To receiver: '${receivers}'`);

  const { bulkMint } = await masa.contracts.asbt.attach(sbtContract);

  return bulkMint(paymentMethod, receivers);
};
