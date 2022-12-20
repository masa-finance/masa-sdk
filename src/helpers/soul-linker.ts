import { BigNumber, ethers } from "ethers";
import Masa from "../masa";
import { signTypedData } from "../utils";
import { verifyTypedData } from "ethers/lib/utils";

export const signSoulLinkerLink = async (
  masa: Masa,
  readerIdentityId: BigNumber,
  ownerIdentityId: BigNumber,
  tokenAddress: string,
  tokenId: BigNumber,
  signatureDate: number = Math.floor(Date.now() / 1000),
  // default to 15 minutes
  expirationDate: number = Math.floor(Date.now() / 1000) + 60 * 15
) => {
  const types = {
    Link: [
      { name: "readerIdentityId", type: "uint256" },
      { name: "ownerIdentityId", type: "uint256" },
      { name: "token", type: "address" },
      { name: "tokenId", type: "uint256" },
      { name: "signatureDate", type: "uint256" },
      { name: "expirationDate", type: "uint256" },
    ],
  };

  const value = {
    readerIdentityId: readerIdentityId,
    ownerIdentityId: ownerIdentityId,
    token: tokenAddress,
    tokenId: tokenId,
    signatureDate: signatureDate,
    expirationDate: expirationDate,
  };

  const { signature, domain } = await signTypedData(
    masa.contracts.identity.SoulLinkerContract,
    masa.config.wallet as ethers.Wallet,
    "SoulLinker",
    types,
    value
  );

  const recover = verifyTypedData(domain, types, value, signature);
  console.log({ recover }, { address: await masa.config.wallet.getAddress() });

  return { signature, signatureDate, expirationDate };
};
