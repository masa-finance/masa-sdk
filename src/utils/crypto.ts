import { Contract, ethers, TypedDataField } from "ethers";

const hashData = (data: any) => ethers.utils.keccak256(data);

export const signMessage = async (
  msg: any,
  wallet: ethers.Signer | ethers.Wallet,
  doHash = false
): Promise<string | undefined> => {
  let sig;

  try {
    const d = ethers.utils.toUtf8Bytes(msg);
    const hash = doHash ? hashData(d) : d;
    sig = await wallet.signMessage(ethers.utils.arrayify(hash));
  } catch (err) {
    console.error("Sign message failed!", err);
  }

  return sig;
};

export const signTypedData = async (
  contract: Contract,
  wallet: ethers.Wallet,
  types: Record<string, Array<TypedDataField>>,
  value: Record<string, any>
) => {
  const chainId = (await wallet.provider.getNetwork()).chainId;

  const domain = {
    name: await contract.name(),
    version: "1.0.0",
    chainId,
    verifyingContract: contract.address,
  };

  const signature = await wallet._signTypedData(domain, types, value);

  return { signature, domain };
};

export const recoverAddress = (
  msg: any,
  signature: string,
  doHash = false
): string | undefined => {
  let recovered;

  try {
    const d = ethers.utils.toUtf8Bytes(msg);
    const hash = doHash ? hashData(d) : d;
    recovered = ethers.utils.recoverAddress(
      ethers.utils.arrayify(
        ethers.utils.hashMessage(ethers.utils.arrayify(hash))
      ),
      signature
    );
  } catch (err) {
    console.error(`Address recovery failed!`, err);
  }

  return recovered;
};
