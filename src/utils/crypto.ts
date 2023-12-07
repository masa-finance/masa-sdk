import type { TypedDataSigner } from "@ethersproject/abstract-signer";
import { EIP712 } from "@masa-finance/masa-contracts-identity";
import type {
  BaseContract,
  BigNumber,
  BytesLike,
  Signer,
  TypedDataDomain,
  TypedDataField,
} from "ethers";
import { utils } from "ethers";

import { logger } from "./logger";

/**
 *
 * @param data
 */
const hashData = (data: BytesLike): string => utils.keccak256(data);

/**
 *
 * @param msg
 * @param signer
 * @param doHash
 */
export const signMessage = async (
  msg: string,
  signer: Signer,
  doHash: boolean = false,
): Promise<string | undefined> => {
  let signature;

  try {
    const data = utils.toUtf8Bytes(msg);
    const hash = doHash ? hashData(data) : data;
    signature = await signer.signMessage(utils.arrayify(hash));
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger("error", `Sign message failed! ${error.message}`);
    }
  }

  return signature;
};

/**
 *
 * @param signer
 * @param name
 * @param verifyingContract
 * @param version
 */
export const generateSignatureDomain = async (
  signer: Signer,
  name: string,
  verifyingContract: string,
  version: string = "1.0.0",
): Promise<TypedDataDomain> => {
  const chainId = (await signer.provider?.getNetwork())?.chainId;

  const domain: TypedDataDomain = {
    name,
    version,
    chainId,
    verifyingContract,
  };

  return domain;
};

const instanceOfEIP712 = (contract: BaseContract): contract is EIP712 => {
  return "eip712Domain" in contract;
};

/**
 *
 * @param contract
 * @param signer
 * @param name
 * @param types
 * @param value
 */
export const signTypedData = async ({
  contract,
  signer,
  name,
  types,
  value,
}: {
  contract: BaseContract | EIP712;
  signer: Signer;
  name?: string;
  types: Record<string, TypedDataField[]>;
  value: Record<string, string | BigNumber | number | boolean>;
}): Promise<{ signature: string; domain: TypedDataDomain }> => {
  let eip712Domain;

  if (instanceOfEIP712(contract)) {
    try {
      eip712Domain = await contract.eip712Domain();
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger("info", `Could not load eip712Domain ${error.message}`);
      }
    }
  }

  const eipName = eip712Domain?.name ?? name;

  if (!eipName) {
    throw new Error("Could not load eip712Name");
  }

  const domain = await generateSignatureDomain(
    signer,
    eipName,
    eip712Domain?.verifyingContract ?? contract.address,
    eip712Domain?.version,
  );

  const signature = await (signer as Signer & TypedDataSigner)._signTypedData(
    domain,
    types,
    value,
  );

  return { signature, domain };
};

/**
 *
 * @param msg
 * @param signature
 * @param doHash
 */
export const recoverAddress = (
  msg: string,
  signature: string,
  doHash: boolean = false,
): string | undefined => {
  let recovered;

  try {
    const data = utils.toUtf8Bytes(msg);
    const hash = doHash ? hashData(data) : data;
    recovered = utils.recoverAddress(
      utils.arrayify(utils.hashMessage(utils.arrayify(hash))),
      signature,
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger("error", `Address recovery failed! ${error.message}`);
    }
  }

  return recovered;
};
