import { BigNumber } from "@ethersproject/bignumber";
import { IERC20, IERC20__factory } from "@masa-finance/masa-contracts-identity";
import {
  BigNumberish,
  BytesLike,
  constants,
  ContractReceipt,
  ContractTransaction,
  utils,
  Wallet,
} from "ethers";
import { addresses, loadIdentityContracts } from "./index";
import { IIdentityContracts, MasaConfig } from "../interface";
import { verifyTypedData } from "ethers/lib/utils";
import { generateSignatureDomain, signTypedData } from "../utils";
import { ERC20__factory } from "./stubs/ERC20__factory";

export type PaymentMethod = "eth" | "weth" | "stable" | "utility";

export class MasaContracts {
  public instances: IIdentityContracts;

  public constructor(private masaConfig: MasaConfig) {
    this.instances = loadIdentityContracts({
      provider: masaConfig.wallet.provider,
      network: masaConfig.network,
    });
  }

  private tools = {
    /**
     * Checks or gives allowance on ERC20 tokens
     * @param paymentAddress
     * @param paymentMethod
     * @param price
     * @private
     */
    checkOrGiveAllowance: async (
      paymentAddress: string,
      paymentMethod: PaymentMethod,
      price: BigNumber
    ): Promise<ContractReceipt | undefined> => {
      if (paymentMethod !== "eth") {
        const contract = IERC20__factory.connect(
          paymentAddress,
          this.masaConfig.wallet
        );

        if (
          (await contract.allowance(
            // owner
            await this.masaConfig.wallet.getAddress(),
            // spender
            this.instances.SoulStoreContract.address
          )) < price
        ) {
          const tx: ContractTransaction = await contract
            .connect(this.masaConfig.wallet)
            .approve(
              // spender
              this.instances.SoulStoreContract.address,
              // amount
              price
            );

          return await tx.wait();
        }
      }
    },

    /**
     * Gets the payment address for a given payment method
     * @param paymentMethod
     * @private
     */
    getPaymentAddress: (paymentMethod: PaymentMethod) => {
      let paymentAddress = constants.AddressZero;

      switch (paymentMethod) {
        case "utility":
          paymentAddress =
            addresses[this.masaConfig.network]?.MASA || constants.AddressZero;
          break;
        case "stable":
          paymentAddress =
            addresses[this.masaConfig.network]?.USDC || constants.AddressZero;
          break;
        case "weth":
          paymentAddress =
            addresses[this.masaConfig.network]?.WETH || constants.AddressZero;
          break;
      }

      return paymentAddress;
    },

    /**
     *
     * @param paymentAddress
     * @param price
     */
    formatPrice: async (paymentAddress: string, price: BigNumber) => {
      let decimals = 18;
      if (paymentAddress !== constants.AddressZero) {
        const contract = ERC20__factory.connect(
          paymentAddress,
          this.masaConfig.wallet
        );
        decimals = await contract.decimals();
      }

      return utils.formatUnits(price, decimals);
    },
  };

  soulLinker = {
    /**
     * Adds a link to the soullinker
     * @param tokenAddress
     * @param paymentMethod
     * @param readerIdentityId
     * @param ownerIdentityId
     * @param tokenId
     * @param signatureDate
     * @param expirationDate
     * @param signature
     * @param slippage
     */
    addLink: async (
      tokenAddress: string,
      paymentMethod: PaymentMethod,
      readerIdentityId: BigNumber,
      ownerIdentityId: BigNumber,
      tokenId: BigNumber,
      signatureDate: number,
      expirationDate: number,
      signature: string,
      slippage: number | undefined = 250
    ): Promise<boolean> => {
      const paymentMethodUsed = this.tools.getPaymentAddress(paymentMethod);
      let price = await this.instances.SoulLinkerContract.getPriceForAddLink(
        paymentMethodUsed,
        tokenAddress
      );

      if (slippage) {
        if (paymentMethod === "eth") {
          price = price.add(price.mul(slippage).div(10000));
        }
      }

      console.log({ paymentMethodUsed, price });

      if (paymentMethod !== "eth") {
        const paymentToken: IERC20 = IERC20__factory.connect(
          paymentMethodUsed,
          this.masaConfig.wallet
        );

        const allowance = await paymentToken.allowance(
          await this.masaConfig.wallet.getAddress(),
          this.instances.SoulLinkerContract.address
        );
        if (allowance < price) {
          console.log("approving allowance");
          await paymentToken.approve(
            this.instances.SoulLinkerContract.address,
            price
          );
        }
      }

      const response = await this.instances.SoulLinkerContract.connect(
        this.masaConfig.wallet
      ).addLink(
        paymentMethodUsed,
        readerIdentityId,
        ownerIdentityId,
        tokenAddress,
        tokenId,
        signatureDate,
        expirationDate,
        signature,
        paymentMethod === "eth" ? { value: price } : undefined
      );

      const tx = await response.wait();
      console.log(tx.transactionHash);

      return true;
    },
  };

  soulName = {
    /**
     * Returns the soulnames of given address
     * @param address
     */
    getSoulNames: async (address: string): Promise<string[]> => {
      const soulNames = await this.instances.SoulboundIdentityContract[
        "getSoulNames(address)"
      ](address);

      console.log("Soul names", soulNames);
      return soulNames;
    },

    /**
     * Check if a soul name is available
     * @param soulName
     */
    isAvailable: async (soulName: string): Promise<boolean> => {
      let available = false;
      if (soulName && soulName.length > 0) {
        available = await this.instances.SoulNameContract.isAvailable(soulName);
      }
      return available;
    },

    /**
     * purchase only name
     * @param paymentMethod
     * @param name
     * @param nameLength
     * @param duration
     * @param metadataURL
     * @param authorityAddress
     * @param signature
     */
    purchase: async (
      paymentMethod: PaymentMethod,
      name: string,
      nameLength: number,
      duration: number = 1,
      metadataURL: string,
      authorityAddress: string,
      signature: string
    ): Promise<ContractTransaction> => {
      const { price, paymentAddress } = await this.soulName.getPrice(
        paymentMethod,
        nameLength,
        duration
      );

      await this.tools.checkOrGiveAllowance(
        paymentAddress,

        paymentMethod,
        price
      );

      const purchaseNameParameters: [
        string, // paymentMethod: PromiseOrValue<string>
        string, // to: PromiseOrValue<string>
        string, // name: PromiseOrValue<string>
        BigNumberish, // nameLength: PromiseOrValue<BigNumberish>
        BigNumberish, // yearsPeriod: PromiseOrValue<BigNumberish>
        string, // tokenURI: PromiseOrValue<string>
        string, // authorityAddress: PromiseOrValue<string>
        BytesLike // signature: PromiseOrValue<BytesLike>
      ] = [
        paymentAddress,
        await this.masaConfig.wallet.getAddress(),
        name,
        nameLength,
        duration,
        metadataURL,
        authorityAddress,
        signature,
      ];

      const purchaseNameOverrides = {
        value: paymentMethod === "eth" ? price : undefined,
      };

      if (this.masaConfig.verbose) {
        console.log({ purchaseNameParameters, purchaseNameOverrides });
      }

      // connect
      const store = this.instances.SoulStoreContract.connect(
        this.masaConfig.wallet
      );

      // estimate gas
      const gasLimit = await store.estimateGas.purchaseName(
        ...purchaseNameParameters,
        purchaseNameOverrides
      );

      // execute
      return await store.purchaseName(...purchaseNameParameters, {
        ...purchaseNameOverrides,
        gasLimit,
      });
    },

    /**
     * Get price for minting a soul name
     * @param paymentMethod
     * @param nameLength
     * @param duration
     * @param slippage
     */
    getPrice: async (
      paymentMethod: PaymentMethod,
      nameLength: number,
      duration: number = 1,
      // slippage in bps where 10000 is 100%. 250 would be 2,5%
      slippage: number | undefined = 250
    ): Promise<{
      price: BigNumber;
      paymentAddress: string;
      formattedPrice: string;
    }> => {
      const paymentAddress = this.tools.getPaymentAddress(paymentMethod);
      let price = await this.instances.SoulStoreContract.getPriceForMintingName(
        paymentAddress,
        nameLength,
        duration
      );

      if (slippage) {
        if (paymentMethod === "eth") {
          price = price.add(price.mul(slippage).div(10000));
        }
      }

      const formattedPrice = await this.tools.formatPrice(
        paymentAddress,
        price
      );

      return {
        price,
        paymentAddress,
        formattedPrice,
      };
    },

    /**
     * Returns detailed information for a soul name
     * @param soulName
     */
    getSoulnameData: async (
      soulName: string
    ): Promise<{ exists: boolean; tokenId: BigNumber }> => {
      return await this.instances.SoulNameContract.nameData(
        soulName.toLowerCase()
      );
    },
  };

  identity = {
    /**
     * purchase only identity
     */
    purchase: async (): Promise<ContractTransaction> => {
      return this.instances.SoulStoreContract.connect(
        this.masaConfig.wallet
      ).purchaseIdentity();
    },

    /**
     * purchase identity with name
     * @param paymentMethod
     * @param name
     * @param nameLength
     * @param duration
     * @param metadataURL
     * @param authorityAddress
     * @param signature
     */
    purchaseIdentityAndName: async (
      paymentMethod: PaymentMethod,
      name: string,
      nameLength: number,
      duration: number = 1,
      metadataURL: string,
      authorityAddress: string,
      signature: string
    ): Promise<ContractTransaction> => {
      const { price, paymentAddress } = await this.soulName.getPrice(
        paymentMethod,
        nameLength,
        duration
      );

      await this.tools.checkOrGiveAllowance(
        paymentAddress,

        paymentMethod,
        price
      );

      const purchaseIdentityAndNameParameters: [
        string, // paymentMethod: PromiseOrValue<string>
        string, // name: PromiseOrValue<string>
        BigNumberish, // nameLength: PromiseOrValue<BigNumberish>
        BigNumberish, // yearsPeriod: PromiseOrValue<BigNumberish>
        string, // tokenURI: PromiseOrValue<string>
        string, // authorityAddress: PromiseOrValue<string>
        BytesLike //signature: PromiseOrValue<BytesLike>
      ] = [
        paymentAddress,
        name,
        nameLength,
        duration,
        metadataURL,
        authorityAddress,
        signature,
      ];

      const purchaseIdentityAndNameOverrides = {
        value: paymentMethod === "eth" ? price : undefined,
      };

      if (this.masaConfig.verbose) {
        console.log({
          purchaseIdentityAndNameParameters,
          purchaseIdentityAndNameOverrides,
        });
      }

      // connect
      const store = this.instances.SoulStoreContract.connect(
        this.masaConfig.wallet
      );

      // estimate gas
      const gasLimit = await store.estimateGas.purchaseIdentityAndName(
        ...purchaseIdentityAndNameParameters,
        purchaseIdentityAndNameOverrides
      );

      // execute tx
      return await store.purchaseIdentityAndName(
        ...purchaseIdentityAndNameParameters,
        {
          ...purchaseIdentityAndNameOverrides,
          gasLimit,
        }
      );
    },
  };

  creditScore = {
    types: {
      MintCreditScore: [
        { name: "identityId", type: "uint256" },
        { name: "authorityAddress", type: "address" },
        { name: "signatureDate", type: "uint256" },
      ],
    },

    /**
     * purchase credit score
     * @param paymentMethod
     * @param identityId
     * @param authorityAddress
     * @param signatureDate
     * @param signature
     * @param slippage
     */
    mint: async (
      paymentMethod: PaymentMethod,
      identityId: BigNumber,
      authorityAddress: string,
      signatureDate: number,
      signature: string,
      slippage: number | undefined = 250
    ): Promise<ContractTransaction> => {
      const value = {
        identityId,
        authorityAddress,
        signatureDate,
      };

      const domain = await generateSignatureDomain(
        this.masaConfig.wallet as Wallet,
        "SoulboundCreditScore",
        this.instances.SoulboundCreditScoreContract.address
      );

      const recoveredAddress = verifyTypedData(
        domain,
        this.creditScore.types,
        value,
        signature
      );

      if (this.masaConfig.verbose) {
        console.log({ recoveredAddress, authorityAddress });
      }

      if (recoveredAddress !== authorityAddress) {
        const msg = "Verifying credit score failed!";
        console.error(msg);
        throw new Error(msg);
      }

      const paymentAddress = this.tools.getPaymentAddress(paymentMethod);

      let price =
        await this.instances.SoulboundCreditScoreContract.getMintPrice(
          paymentAddress
        );

      if (slippage) {
        if (paymentMethod === "eth") {
          price = price.add(price.mul(slippage).div(10000));
        }
      }

      const creditScoreMintParameters: [
        string,
        BigNumber,
        string,
        number,
        string
      ] = [
        paymentAddress,
        identityId,
        authorityAddress,
        signatureDate,
        signature,
      ];

      const creditScoreMintOverrides = {
        value: price,
      };

      if (this.masaConfig.verbose) {
        console.log({ creditScoreMintParameters, creditScoreMintOverrides });
      }

      // connect
      const creditScoreContract =
        await this.instances.SoulboundCreditScoreContract.connect(
          this.masaConfig.wallet
        );

      // estimate
      const gasLimit = await creditScoreContract.estimateGas[
        "mint(address,uint256,address,uint256,bytes)"
      ](...creditScoreMintParameters, creditScoreMintOverrides);

      // execute
      return creditScoreContract["mint(address,uint256,address,uint256,bytes)"](
        ...creditScoreMintParameters,
        { ...creditScoreMintOverrides, gasLimit }
      );
    },

    /**
     * Signs a credit score
     * @param identityId
     */
    sign: async (
      identityId: BigNumber
    ): Promise<
      | {
          signature: string;
          signatureDate: number;
          authorityAddress: string;
        }
      | undefined
    > => {
      const signatureDate = Math.floor(Date.now() / 1000);

      const authorityAddress = await this.masaConfig.wallet.getAddress();
      const value: {
        identityId: BigNumber;
        authorityAddress: string;
        signatureDate: number;
      } = {
        identityId,
        authorityAddress,
        signatureDate,
      };

      const { signature, domain } = await signTypedData(
        this.instances.SoulboundCreditScoreContract,
        this.masaConfig.wallet as Wallet,
        "SoulboundCreditScore",
        this.creditScore.types,
        value
      );

      const recoveredAddress = verifyTypedData(
        domain,
        this.creditScore.types,
        value,
        signature
      );

      if (this.masaConfig.verbose) {
        console.log({ recoveredAddress, authorityAddress });
      }

      if (recoveredAddress === authorityAddress) {
        return { signature, signatureDate, authorityAddress };
      } else {
        console.error("Signing credit score failed!");
      }
    },
  };

  green = {
    types: {
      MintGreen: [
        { name: "to", type: "address" },
        { name: "authorityAddress", type: "address" },
        { name: "signatureDate", type: "uint256" },
      ],
    },

    /**
     * Gets the price for a masa green
     * @param paymentMethod
     * @param slippage
     */
    getPrice: async (
      paymentMethod: PaymentMethod,
      slippage: number | undefined = 250
    ): Promise<{
      price: BigNumber;
      paymentAddress: string;
      formattedPrice: string;
      mintTransactionEstimatedGas: BigNumber;
      mintTransactionFee: BigNumber;
      formattedMintTransactionFee: string;
    }> => {
      const paymentAddress = this.tools.getPaymentAddress(paymentMethod);

      let price = await this.instances.SoulboundGreenContract.getMintPrice(
        paymentAddress
      );

      if (slippage) {
        if (paymentMethod === "eth") {
          price = price.add(price.mul(slippage).div(10000));
        }
      }

      const formattedPrice: string = await this.tools.formatPrice(
        paymentAddress,
        price
      );

      const gasPrice = await this.masaConfig.wallet.getGasPrice();
      // hardcoded estimation for now
      const mintTransactionEstimatedGas = BigNumber.from(250_000);
      const mintTransactionFee = gasPrice.mul(mintTransactionEstimatedGas);

      const formattedMintTransactionFee: string = await this.tools.formatPrice(
        paymentAddress,
        mintTransactionFee
      );

      return {
        price,
        paymentAddress,
        formattedPrice,
        mintTransactionEstimatedGas,
        mintTransactionFee,
        formattedMintTransactionFee,
      };
    },

    /**
     * Purchase a masa green
     * @param paymentMethod
     * @param receiver
     * @param authorityAddress
     * @param signatureDate
     * @param signature
     * @param slippage
     */
    mint: async (
      paymentMethod: PaymentMethod,
      receiver: string,
      authorityAddress: string,
      signatureDate: number,
      signature: string,
      slippage: number | undefined = 250
    ): Promise<ContractTransaction> => {
      const value: {
        to: string;
        authorityAddress: string;
        signatureDate: number;
      } = {
        to: receiver,
        authorityAddress: authorityAddress,
        signatureDate: signatureDate,
      };

      const domain = await generateSignatureDomain(
        this.masaConfig.wallet as Wallet,
        "SoulboundGreen",
        this.instances.SoulboundGreenContract.address
      );

      if (this.masaConfig.verbose) {
        console.log({ domain, value });
      }

      const recoveredAddress = verifyTypedData(
        domain,
        this.green.types,
        value,
        signature
      );

      if (this.masaConfig.verbose) {
        console.log({ recoveredAddress, authorityAddress });
      }

      if (recoveredAddress !== authorityAddress) {
        const msg = "Verifying green failed!";
        console.error(msg);
        throw new Error(msg);
      }

      const { paymentAddress, price, formattedPrice, mintTransactionFee } =
        await this.green.getPrice(paymentMethod, slippage);

      if (this.masaConfig.verbose) {
        console.log({
          price: price.toString(),
          mintTransactionFee: mintTransactionFee.toString(),
          paymentAddress,
          formattedPrice,
        });
      }

      const greenMintParameters: [string, string, string, number, string] = [
        paymentAddress,
        await this.masaConfig.wallet.getAddress(),
        authorityAddress,
        signatureDate,
        signature,
      ];

      const greenMintOverrides = {
        value: price,
      };

      if (this.masaConfig.verbose) {
        console.log({ greenMintParameters, greenMintOverrides });
      }

      // connect
      const contract = await this.instances.SoulboundGreenContract.connect(
        this.masaConfig.wallet
      );

      // estimate gas
      const gasLimit = contract.estimateGas[
        "mint(address,address,address,uint256,bytes)"
      ](...greenMintParameters, greenMintOverrides);

      // execute
      return contract["mint(address,address,address,uint256,bytes)"](
        ...greenMintParameters,
        { ...greenMintOverrides, gasLimit }
      );
    },

    /**
     * Signs a masa green
     * @param receiver
     */
    sign: async (
      receiver: string
    ): Promise<
      | {
          signature: string;
          signatureDate: number;
          authorityAddress: string;
        }
      | undefined
    > => {
      const signatureDate = Math.floor(Date.now() / 1000);

      const authorityAddress = await this.masaConfig.wallet.getAddress();
      const value: {
        to: string;
        authorityAddress: string;
        signatureDate: number;
      } = {
        to: receiver,
        authorityAddress,
        signatureDate,
      };

      const { signature, domain } = await signTypedData(
        this.instances.SoulboundGreenContract,
        this.masaConfig.wallet as Wallet,
        "SoulboundGreen",
        this.green.types,
        value
      );

      if (this.masaConfig.verbose) {
        console.log({ domain, value });
      }

      const recoveredAddress = verifyTypedData(
        domain,
        this.green.types,
        value,
        signature
      );

      if (this.masaConfig.verbose) {
        console.log({ recoveredAddress, authorityAddress });
      }

      if (recoveredAddress === authorityAddress) {
        return { signature, signatureDate, authorityAddress };
      } else {
        console.error("Signing green failed!");
      }
    },
  };
}
