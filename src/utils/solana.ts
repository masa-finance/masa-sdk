import {
  Keypair,
  LAMPORTS_PER_SOL,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";

const secretKey = Uint8Array.from([
  202, 171, 192, 129, 150, 189, 204, 241, 142, 71, 205, 2, 81, 97, 2, 176, 48,
  81, 45, 1, 96, 138, 220, 132, 231, 131, 120, 77, 66, 40, 97, 172, 91, 245, 84,
  221, 157, 190, 9, 145, 176, 130, 25, 43, 72, 107, 190, 229, 75, 88, 191, 136,
  7, 167, 109, 91, 170, 164, 186, 15, 142, 36, 12, 23,
]);

const keypair: Keypair = Keypair.fromSecretKey(secretKey);

const transaction: Transaction = new Transaction();

console.log(keypair.publicKey);

transaction.add(
  SystemProgram.transfer({
    fromPubkey: keypair.publicKey,
    toPubkey: keypair.publicKey,
    lamports: 0.1 * LAMPORTS_PER_SOL,
  }),
);
