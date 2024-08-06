import { Keypair } from "@solana/web3.js";
import type { Signer } from "ethers";

/**
 *
 * @param signer
 */
export const isSigner = (
  signer: Signer | { keypair: Keypair },
): signer is Signer => {
  return (signer as Signer)._isSigner;
};
