import { ethers } from "ethers";

export const createRandomWallet = () => {
  const wallet = ethers.Wallet.createRandom();

  wallet.connect(
    new ethers.providers.JsonRpcProvider("https://rpc.ankr.com/eth_goerli")
  );
  return wallet;
};
