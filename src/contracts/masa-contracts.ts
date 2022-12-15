import { BigNumber } from "@ethersproject/bignumber";
import {
  IERC20,
  IERC20__factory,
  MASA__factory,
} from "@masa-finance/masa-contracts-identity";
import { ContractReceipt, ContractTransaction, ethers, Signer } from "ethers";
import { addresses, loadIdentityContracts } from "./index";
import { IIdentityContracts, MasaConfig } from "../interface";

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
    signer: Signer,
    tokenAddress: string,
    paymentMethod: PaymentMethod,
    receiverIdentityId: BigNumber,
    ownerIdentityId: BigNumber,
    tokenId: BigNumber,
    signatureDate: number,
    expirationDate: number,
    signature: string
  ) {
    const { price, paymentMethodUsed } =
      await this.identity.SoulLinkerContract.getPriceForAddPermission(
        this.getPaymentAddress(paymentMethod)
      );

    const masaToken: IERC20 = IERC20__factory.connect(
      paymentMethodUsed,
      signer
    );
    await masaToken.approve(this.identity.SoulLinkerContract.address, price);

    // 52 24
    // 0x4cf933827818586f365fa55bb0ce3e39d61e170063a7177f08809fbc6ea157eb7c9b8756745147e72d4832b0e3dd8bc562422e2d16aa602bbfdab21f3917fa761b 1671094232 1671095132
    await this.identity.SoulLinkerContract.connect(signer).addPermission(
      paymentMethodUsed,
      receiverIdentityId,
      ownerIdentityId,
      tokenAddress,
      tokenId,
      // this is rubbish
      JSON.stringify({}),
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
  async purchaseIdentity(signer: Signer): Promise<ContractTransaction> {
    return this.identity.SoulStoreContract.connect(signer).purchaseIdentity();
  }

  // purchase only identity with name
  async purchaseIdentityAndName(
    signer: Signer,
    name: string,
    paymentMethod: PaymentMethod,
    duration = 1,
    metadataURL: string
  ): Promise<ContractTransaction> {
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
    signer: Signer,
    name: string,
    paymentMethod: PaymentMethod,
    duration = 1,
    metadataURL: string
  ): Promise<ContractTransaction> {
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
    signer: Signer,
    paymentMethod: PaymentMethod,
    price: BigNumber
  ): Promise<ContractReceipt | undefined> {
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
        const tx: ContractTransaction = await contract.connect(signer).approve(
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
    signer: Signer
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
    signer: Signer,
    paymentMethod: PaymentMethod,
    date: number,
    wallet: string,
    signature: string
  ): Promise<ContractTransaction> {
    return await this.identity.SoulboundCreditScoreContract.connect(signer)[
      "mint(address,address,address,uint256,bytes)"
    ](
      paymentMethod,
      wallet,
      "0x3c8D9f130970358b7E8cbc1DbD0a1EbA6EBE368F",
      date,
      signature
    );
  }
}
