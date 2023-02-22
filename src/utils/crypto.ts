import {
  BigNumber,
  BytesLike,
  Contract,
  Signer,
  TypedDataField,
  utils,
  Wallet,
} from "ethers";

const hashData = (data: BytesLike) => utils.keccak256(data);

export const signMessage = async (
  msg: string,
  wallet: Signer | Wallet,
  doHash: boolean = false
): Promise<string | undefined> => {
  let signature;

  try {
    const data = utils.toUtf8Bytes(msg);
    const hash = doHash ? hashData(data) : data;
    signature = await wallet.signMessage(utils.arrayify(hash));
  } catch (error) {
    console.error("Sign message failed!", error);
  }

  return signature;
};

export const signTypedData = async (
  contract: Contract,
  wallet: Wallet,
  name: string,
  types: Record<string, Array<TypedDataField>>,
  value: Record<string, string | BigNumber | number>
) => {
  const domain = await generateSignatureDomain(wallet, name, contract.address);
  const signature = await wallet._signTypedData(domain, types, value);

  return { signature, domain };
};

export const generateSignatureDomain = async (
  wallet: Wallet,
  name: string,
  verifyingContract: string
) => {
  const chainId = (await wallet.provider.getNetwork()).chainId;

  const domain = {
    name,
    version: "1.0.0",
    chainId,
    verifyingContract,
  };

  return domain;
};

export const recoverAddress = (
  msg: string,
  signature: string,
  doHash: boolean = false
): string | undefined => {
  let recovered;

  try {
    const data = utils.toUtf8Bytes(msg);
    const hash = doHash ? hashData(data) : data;
    recovered = utils.recoverAddress(
      utils.arrayify(utils.hashMessage(utils.arrayify(hash))),
      signature
    );
  } catch (err) {
    console.error(`Address recovery failed!`, err);
  }

  return recovered;
};
