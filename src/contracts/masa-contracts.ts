import { BigNumber } from "@ethersproject/bignumber";
import {
  IERC20,
  IERC20__factory,
  MASA__factory,
} from "@masa-finance/masa-contracts-identity";
import { ethers } from "ethers";
import { addresses, loadIdentityContracts } from "./index";
import { IIdentityContracts, MasaConfig } from "../interface";
import { verifyTypedData } from "ethers/lib/utils";
import { generateSignatureDomain } from "../utils";

export type PaymentMethod = "eth" | "weth" | "stable" | "utility";

export class MasaContracts {
  public identity: IIdentityContracts;

  public constructor(private masaConfig: MasaConfig) {
    this.identity = loadIdentityContracts({
      provider: masaConfig.wallet.provider,
      network: masaConfig.network,
    });
  }

  private getPaymentAddress(paymentMethod: PaymentMethod) {
    let paymentAddress = ethers.constants.AddressZero;

    switch (paymentMethod) {
      case "utility":
        paymentAddress = addresses[this.masaConfig.network].MASA;
        break;
      case "stable":
        paymentAddress = addresses[this.masaConfig.network].USDC;
        break;
      case "weth":
        paymentAddress = addresses[this.masaConfig.network].WETH;
        break;
    }

    return paymentAddress;
  }

  async addPermission(
    signer: ethers.Signer,
    tokenAddress: string,
    paymentMethod: PaymentMethod,
    receiverIdentityId: BigNumber,
    ownerIdentityId: BigNumber,
    tokenId: BigNumber,
    signatureDate: number,
    expirationDate: number,
    signature: string
  ) {
    const paymentMethodUsed = this.getPaymentAddress(paymentMethod);
    const price = await this.identity.SoulLinkerContract.getPriceForAddLink(
      paymentMethodUsed,
      tokenAddress
    );

    console.log(paymentMethodUsed);

    if (paymentMethod !== "eth") {
      const paymentToken: IERC20 = IERC20__factory.connect(
        paymentMethodUsed,
        signer
      );

      const allowance = await paymentToken.allowance(
        await signer.getAddress(),
        this.identity.SoulLinkerContract.address
      );
      if (allowance < price) {
        console.log("approving allowance");
        await paymentToken.approve(
          this.identity.SoulLinkerContract.address,
          price
        );
      }
    }

    // 52 24
    // 0x4cf933827818586f365fa55bb0ce3e39d61e170063a7177f08809fbc6ea157eb7c9b8756745147e72d4832b0e3dd8bc562422e2d16aa602bbfdab21f3917fa761b 1671094232 1671095132
    await this.identity.SoulLinkerContract.connect(signer).addLink(
      paymentMethodUsed,
      receiverIdentityId,
      ownerIdentityId,
      tokenAddress,
      tokenId,
      signatureDate,
      expirationDate,
      signature
    );
  }

  async getSoulNames(address: string): Promise<string[]> {
    const soulNames = await this.identity.SoulboundIdentityContract[
      "getSoulNames(address)"
    ](address);

    console.log("Soul names", soulNames);
    return soulNames;
  }

  async isAvailable(soulName: string): Promise<boolean> {
    let available = false;
    if (soulName && soulName.length > 0) {
      available = await this.identity.SoulNameContract.isAvailable(soulName);
    }
    return available;
  }

  // purchase only identity
  async purchaseIdentity(
    signer: ethers.Signer
  ): Promise<ethers.ContractTransaction> {
    return this.identity.SoulStoreContract.connect(signer).purchaseIdentity();
  }

  // purchase only identity with name
  async purchaseIdentityAndName(
    signer: ethers.Signer,
    name: string,
    paymentMethod: PaymentMethod,
    duration = 1,
    metadataURL: string
  ): Promise<ethers.ContractTransaction> {
    const { price, paymentAddress } = await this.getPaymentInformation(
      name,
      paymentMethod,
      duration,
      signer
    );

    await this.checkOrGiveAllowance(
      paymentAddress,
      signer,

      paymentMethod,
      price
    );

    const tx = await this.identity.SoulStoreContract.connect(
      signer
    ).purchaseIdentityAndName(paymentAddress, name, duration, metadataURL, {
      value: paymentMethod === "eth" ? price : undefined,
    });

    return tx;
  }

  // purchase only name
  async purchaseName(
    signer: ethers.Signer,
    name: string,
    paymentMethod: PaymentMethod,
    duration = 1,
    metadataURL: string
  ): Promise<ethers.ContractTransaction> {
    const { price, paymentAddress } = await this.getPaymentInformation(
      name,
      paymentMethod,
      duration,
      signer
    );

    await this.checkOrGiveAllowance(
      paymentAddress,
      signer,

      paymentMethod,
      price
    );

    const tx = this.identity.SoulStoreContract.connect(signer).purchaseName(
      paymentAddress,
      name,
      duration,
      metadataURL,
      signer.getAddress(),
      {
        value: paymentMethod === "eth" ? price : undefined,
      }
    );

    return tx;
  }

  private async checkOrGiveAllowance(
    paymentAddress: string,
    signer: ethers.Signer,
    paymentMethod: PaymentMethod,
    price: BigNumber
  ): Promise<ethers.ContractReceipt | undefined> {
    if (paymentMethod !== "eth") {
      const contract = MASA__factory.connect(paymentAddress, signer);

      if (
        (await contract.allowance(
          // owner
          await signer.getAddress(),
          // spender
          this.identity.SoulStoreContract.address
        )) < price
      ) {
        const tx: ethers.ContractTransaction = await contract
          .connect(signer)
          .approve(
            // spender
            this.identity.SoulStoreContract.address,
            // amount
            price
          );

        return await tx.wait();
      }
    }
  }

  async getPaymentInformation(
    name: string,
    paymentMethod: PaymentMethod,
    duration = 1,
    signer: ethers.Signer
  ): Promise<{
    price: BigNumber;
    paymentAddress: string;
    formattedPrice: string;
  }> {
    const paymentAddress = this.getPaymentAddress(paymentMethod);
    const price = await this.identity.SoulStoreContract.getPriceForMintingName(
      paymentAddress,
      name,
      duration
    );

    let decimals = 18;
    if (paymentAddress !== ethers.constants.AddressZero) {
      const contract = MASA__factory.connect(paymentAddress, signer);
      decimals = await contract.decimals();
    }

    const formattedPrice = ethers.utils.formatUnits(price, decimals);

    return {
      price,
      paymentAddress,
      formattedPrice,
    };
  }

  // purchase only identity
  async mintCreditScore(
    wallet: ethers.Wallet,
    paymentMethod: PaymentMethod,
    identityId: BigNumber,
    authorityAddress: string,
    signatureDate: number,
    signature: string
  ): Promise<ethers.ContractTransaction> {
    const types = {
      MintCreditScore: [
        { name: "identityId", type: "uint256" },
        { name: "authorityAddress", type: "address" },
        { name: "signatureDate", type: "uint256" },
      ],
    };

    const value = {
      identityId,
      authorityAddress,
      signatureDate,
    };

    const domain = await generateSignatureDomain(
      wallet,
      "SoulboundCreditScore",
      this.identity.SoulboundCreditScoreContract.address
    );

    const recoveredAddress = verifyTypedData(domain, types, value, signature);
    console.log("lala", { recoveredAddress }, { authorityAddress });

    return await this.identity.SoulboundCreditScoreContract.connect(wallet)[
      "mint(address,uint256,address,uint256,bytes)"
    ](paymentMethod, identityId, authorityAddress, signatureDate, signature);
  }
}
