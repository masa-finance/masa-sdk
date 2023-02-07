import { BigNumber } from "@ethersproject/bignumber";
import { IERC20, IERC20__factory } from "@masa-finance/masa-contracts-identity";
import {
  BigNumberish,
  BytesLike,
  constants,
  ContractReceipt,
  ContractTransaction,
  Signer,
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
     * @param signer
     * @param paymentMethod
     * @param price
     * @private
     */
    checkOrGiveAllowance: async (
      paymentAddress: string,
      signer: Signer,
      paymentMethod: PaymentMethod,
      price: BigNumber
    ): Promise<ContractReceipt | undefined> => {
      if (paymentMethod !== "eth") {
        const contract = IERC20__factory.connect(paymentAddress, signer);

        if (
          (await contract.allowance(
            // owner
            await signer.getAddress(),
            // spender
            this.instances.SoulStoreContract.address
          )) < price
        ) {
          const tx: ContractTransaction = await contract
            .connect(signer)
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
  };

  soulLinker = {
    /**
     * Adds a link to the soullinker
     * @param signer
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
      signer: Signer,
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
          signer
        );

        const allowance = await paymentToken.allowance(
          await signer.getAddress(),
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
        signer
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
     * @param signer
     * @param paymentMethod
     * @param name
     * @param nameLength
     * @param duration
     * @param metadataURL
     * @param authorityAddress
     * @param signature
     * @param debug
     */
    purchase: async (
      signer: Signer,
      paymentMethod: PaymentMethod,
      name: string,
      nameLength: number,
      duration = 1,
      metadataURL: string,
      authorityAddress: string,
      signature: string,
      debug = false
    ): Promise<ContractTransaction> => {
      const { price, paymentAddress } = await this.soulName.getPrice(
        signer,
        paymentMethod,
        nameLength,
        duration
      );

      await this.tools.checkOrGiveAllowance(
        paymentAddress,
        signer,

        paymentMethod,
        price
      );

      const params: [
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
        await signer.getAddress(),
        name,
        nameLength,
        duration,
        metadataURL,
        authorityAddress,
        signature,
      ];

      const overrides = {
        value: paymentMethod === "eth" ? price : undefined,
      };

      if (debug) {
        console.log("purchaseName", params, overrides);
      }

      // connect
      const store = this.instances.SoulStoreContract.connect(signer);
      // estimate gas
      const gasLimit = await store.estimateGas.purchaseName(
        ...params,
        overrides
      );
      // execute
      const tx = await store.purchaseName(...params, {
        ...overrides,
        gasLimit,
      });

      return tx;
    },

    /**
     * Get price for minting a soul name
     * @param signer
     * @param paymentMethod
     * @param nameLength
     * @param duration
     * @param slippage
     */
    getPrice: async (
      signer: Signer,
      paymentMethod: PaymentMethod,
      nameLength: number,
      duration = 1,
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

      let decimals = 18;
      if (paymentAddress !== constants.AddressZero) {
        const contract = ERC20__factory.connect(paymentAddress, signer);
        decimals = await contract.decimals();
      }

      const formattedPrice = utils.formatUnits(price, decimals);

      return {
        price,
        paymentAddress,
        formattedPrice,
      };
    },
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
     * @param signer
     */
    purchase: async (signer: Signer): Promise<ContractTransaction> => {
      return this.instances.SoulStoreContract.connect(
        signer
      ).purchaseIdentity();
    },

    /**
     * purchase identity with name
     * @param signer
     * @param paymentMethod
     * @param name
     * @param nameLength
     * @param duration
     * @param metadataURL
     * @param authorityAddress
     * @param signature
     * @param debug
     */
    purchaseIdentityAndName: async (
      signer: Signer,
      paymentMethod: PaymentMethod,
      name: string,
      nameLength: number,
      duration = 1,
      metadataURL: string,
      authorityAddress: string,
      signature: string,
      debug = false
    ): Promise<ContractTransaction> => {
      const { price, paymentAddress } = await this.soulName.getPrice(
        signer,
        paymentMethod,
        nameLength,
        duration
      );

      await this.tools.checkOrGiveAllowance(
        paymentAddress,
        signer,

        paymentMethod,
        price
      );

      const params: [
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

      const overrides = {
        value: paymentMethod === "eth" ? price : undefined,
      };

      if (debug) {
        console.log("purchaseIdentityAndName", params, overrides);
      }

      // connect
      const store = this.instances.SoulStoreContract.connect(signer);
      // estimate gas
      const gasLimit = await store.estimateGas.purchaseIdentityAndName(
        ...params,
        overrides
      );
      // execute tx
      const tx = await store.purchaseIdentityAndName(...params, {
        ...overrides,
        gasLimit,
      });

      return tx;
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
     * @param wallet
     * @param paymentMethod
     * @param identityId
     * @param authorityAddress
     * @param signatureDate
     * @param signature
     * @param slippage
     */
    mint: async (
      wallet: Wallet,
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
        wallet,
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

      const parameter: [string, BigNumber, string, number, string] = [
        paymentAddress,
        identityId,
        authorityAddress,
        signatureDate,
        signature,
      ];

      if (this.masaConfig.verbose) {
        console.log({ parameter });
      }

      return await this.instances.SoulboundCreditScoreContract.connect(wallet)[
        "mint(address,uint256,address,uint256,bytes)"
      ](...parameter, {
        value: price,
      });
    },

    sign: async (
      wallet: Wallet,
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

      const authorityAddress = await wallet.getAddress();
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
        wallet,
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
     * Purchase a masa green
     * @param wallet
     * @param paymentMethod
     * @param receiver
     * @param authorityAddress
     * @param signatureDate
     * @param signature
     * @param slippage
     */
    mint: async (
      wallet: Wallet,
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
        wallet,
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

      const paymentAddress = this.tools.getPaymentAddress(paymentMethod);

      let price = await this.instances.SoulboundGreenContract.getMintPrice(
        paymentAddress
      );

      if (slippage) {
        if (paymentMethod === "eth") {
          price = price.add(price.mul(slippage).div(10000));
        }
      }

      const parameter: [string, string, string, number, string] = [
        paymentAddress,
        await wallet.getAddress(),
        authorityAddress,
        signatureDate,
        signature,
      ];

      if (this.masaConfig.verbose) {
        console.log({ parameter });
      }

      return await this.instances.SoulboundGreenContract.connect(wallet)[
        "mint(address,address,address,uint256,bytes)"
      ](...parameter, {
        value: price,
      });
    },

    /**
     * Signs a masa green
     * @param wallet
     * @param receiver
     */
    sign: async (
      wallet: Wallet,
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

      const authorityAddress = await wallet.getAddress();
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
        wallet,
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
