import { BigNumber } from "@ethersproject/bignumber";
import {
  IERC20,
  IERC20__factory,
  MasaSBTSelfSovereign,
  MasaSBTSelfSovereign__factory,
  SoulLinker,
  SoulStore,
} from "@masa-finance/masa-contracts-identity";
import {
  constants,
  ContractReceipt,
  ContractTransaction,
  TypedDataDomain,
  TypedDataField,
  utils,
  Wallet,
} from "ethers";
import {
  addresses,
  ContractFactory,
  loadIdentityContracts,
  loadSBTContract,
} from "./index";
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

    /**
     * adds a percentage to the price as slippage
     * @param price
     * @param slippage
     */
    addSlippage: (price: BigNumber, slippage: number) => {
      price = price.add(price.mul(slippage).div(10000));
      return price;
    },

    /**
     * verify a signature created during one of the SBT signing flows
     * @param errorMessage
     * @param domain
     * @param contract
     * @param types
     * @param value
     * @param signature
     * @param authorityAddress
     */
    verify: async (
      errorMessage: string,
      contract: MasaSBTSelfSovereign | SoulStore | SoulLinker,
      domain: TypedDataDomain,
      types: Record<string, Array<TypedDataField>>,
      value: Record<string, string | BigNumber | number>,
      signature: string,
      authorityAddress: string
    ) => {
      if (this.masaConfig.verbose) {
        console.log({
          domain,
          types: JSON.stringify(types),
          value,
          signature,
          authorityAddress,
        });
      }

      const hasAuthorities = (
        contract: MasaSBTSelfSovereign | SoulStore | SoulLinker
      ): contract is MasaSBTSelfSovereign => {
        return (contract as MasaSBTSelfSovereign).authorities !== undefined;
      };

      // first line of defense, check that the address properly recovers
      const recoveredAddress = verifyTypedData(domain, types, value, signature);

      if (this.masaConfig.verbose) {
        console.info({
          recoveredAddress,
          authorityAddress,
        });
      }

      // if this fails we throw
      if (recoveredAddress !== authorityAddress) {
        throw new Error(`${errorMessage}: Signature Verification failed!`);
      }

      // second line of defense, if the contract supports authorities
      if (hasAuthorities(contract)) {
        let recoveredAddressIsAuthority = false;

        try {
          recoveredAddressIsAuthority = await contract.authorities(
            recoveredAddress
          );
        } catch (error) {
          if (error instanceof Error)
            console.error(`Retrieving authorities failed! ${error.message}.`);
        }

        if (this.masaConfig.verbose) {
          console.info({
            recoveredAddressIsAuthority,
          });
        }

        // we check that the recovered address is within the authorities
        if (!recoveredAddressIsAuthority) {
          throw new Error(
            `${errorMessage}: Authority '${recoveredAddress}' not allowed!`
          );
        }
      }
    },
  };

  sbt = async <Contract extends MasaSBTSelfSovereign>(
    address: string,
    factory: ContractFactory = MasaSBTSelfSovereign__factory
  ) => {
    const selfSovereignSBT: Contract | undefined = await loadSBTContract(
      this.masaConfig,
      address,
      factory
    );

    return {
      /**
       * instance of the SBT that this factory instance uses
       */
      selfSovereignSBT,

      /**
       * Signs an SBT based on its address
       * @param name
       * @param types
       * @param value
       */
      sign: async (
        name: string,
        types: Record<string, Array<TypedDataField>>,
        value: Record<string, string | BigNumber | number>
      ): Promise<
        | {
            signature: string;
            authorityAddress: string;
          }
        | undefined
      > => {
        if (!selfSovereignSBT) return;

        const authorityAddress = await this.masaConfig.wallet.getAddress();

        const { signature, domain } = await signTypedData(
          selfSovereignSBT,
          this.masaConfig.wallet as Wallet,
          name,
          types,
          value
        );

        await this.tools.verify(
          "Signing SBT failed!",
          selfSovereignSBT,
          domain,
          types,
          value,
          signature,
          authorityAddress
        );

        return { signature, authorityAddress };
      },

      getPrice: async (
        paymentMethod: PaymentMethod,
        slippage: number | undefined = 250
      ) => {
        if (!selfSovereignSBT) return;

        const paymentAddress = this.tools.getPaymentAddress(paymentMethod);

        let price = await selfSovereignSBT.getMintPrice(paymentAddress);

        if (slippage) {
          if (paymentMethod === "eth") {
            price = this.tools.addSlippage(price, slippage);
          }
        }

        const formattedPrice: string = await this.tools.formatPrice(
          paymentAddress,
          price
        );

        return {
          price,
          paymentAddress,
          formattedPrice,
        };
      },

      prepareMint: async (
        paymentMethod: PaymentMethod,
        name: string,
        types: Record<string, Array<TypedDataField>>,
        value: Record<string, string | BigNumber | number>,
        signature: string,
        authorityAddress: string,
        slippage: number | undefined = 250
      ) => {
        if (!selfSovereignSBT) return;

        const domain: TypedDataDomain = await generateSignatureDomain(
          this.masaConfig.wallet as Wallet,
          name,
          selfSovereignSBT.address
        );

        await this.tools.verify(
          "Verifying SBT failed!",
          selfSovereignSBT,
          domain,
          types,
          value,
          signature,
          authorityAddress
        );

        const { getPrice } = await this.sbt<Contract>(address, factory);
        const priceObject = await getPrice(paymentMethod, slippage);

        if (!priceObject) return;

        if (this.masaConfig.verbose) {
          console.log({
            price: priceObject.price.toString(),
            paymentAddress: priceObject.paymentAddress,
            formattedPrice: priceObject.formattedPrice,
          });
        }

        return {
          price: priceObject.price,
          paymentAddress: priceObject.paymentAddress,
        };
      },
    };
  };

  soulLinker = {
    types: {
      Link: [
        { name: "readerIdentityId", type: "uint256" },
        { name: "ownerIdentityId", type: "uint256" },
        { name: "token", type: "address" },
        { name: "tokenId", type: "uint256" },
        { name: "signatureDate", type: "uint256" },
        { name: "expirationDate", type: "uint256" },
      ],
    },

    /**
     * Gets price for establishing a link
     * @param tokenAddress
     * @param paymentMethod
     * @param slippage
     */
    getPrice: async (
      tokenAddress: string,
      paymentMethod: PaymentMethod,
      slippage: number | undefined = 250
    ): Promise<{ price: BigNumber; paymentAddress: string }> => {
      const paymentAddress = this.tools.getPaymentAddress(paymentMethod);
      let price = await this.instances.SoulLinkerContract.getPriceForAddLink(
        paymentAddress,
        tokenAddress
      );

      if (slippage) {
        if (paymentMethod === "eth") {
          price = this.tools.addSlippage(price, slippage);
        }
      }

      if (this.masaConfig.verbose) {
        console.info({ paymentAddress, price });
      }

      return {
        price,
        paymentAddress,
      };
    },
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
      const { price, paymentAddress } = await this.soulLinker.getPrice(
        tokenAddress,
        paymentMethod,
        slippage
      );

      if (paymentMethod !== "eth") {
        const paymentToken: IERC20 = IERC20__factory.connect(
          paymentAddress,
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

      const addLinkTransactionResponse =
        await this.instances.SoulLinkerContract.connect(
          this.masaConfig.wallet
        ).addLink(
          paymentAddress,
          readerIdentityId,
          ownerIdentityId,
          tokenAddress,
          tokenId,
          signatureDate,
          expirationDate,
          signature,
          paymentMethod === "eth" ? { value: price } : undefined
        );

      const addLinkTransactionReceipt = await addLinkTransactionResponse.wait();
      console.log(addLinkTransactionReceipt.transactionHash);

      return true;
    },

    /**
     * Signs a soul linker link
     * @param readerIdentityId
     * @param ownerIdentityId
     * @param tokenAddress
     * @param tokenId
     * @param signatureDate
     * @param expirationOffset
     */
    signLink: async (
      readerIdentityId: BigNumber,
      ownerIdentityId: BigNumber,
      tokenAddress: string,
      tokenId: BigNumber,
      // now
      signatureDate: number = Math.floor(Date.now() / 1000),
      // default to 15 minutes
      expirationOffset: number = 60 * 15
    ) => {
      const expirationDate = signatureDate + expirationOffset;

      const value: {
        readerIdentityId: BigNumber;
        ownerIdentityId: BigNumber;
        token: string;
        tokenId: BigNumber;
        signatureDate: number;
        expirationDate: number;
      } = {
        readerIdentityId,
        ownerIdentityId,
        token: tokenAddress,
        tokenId,
        signatureDate,
        expirationDate,
      };

      const { signature, domain } = await signTypedData(
        this.instances.SoulLinkerContract,
        this.masaConfig.wallet as Wallet,
        "SoulLinker",
        this.soulLinker.types,
        value
      );

      await this.tools.verify(
        "Signing SBT failed!",
        this.instances.SoulLinkerContract,
        domain,
        this.soulLinker.types,
        value,
        signature,
        await this.masaConfig.wallet.getAddress()
      );

      return { signature, signatureDate, expirationDate };
    },
  };

  soulName = {
    types: {
      MintSoulName: [
        { name: "to", type: "address" },
        { name: "name", type: "string" },
        { name: "nameLength", type: "uint256" },
        { name: "yearsPeriod", type: "uint256" },
        { name: "tokenURI", type: "string" },
      ],
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
     * @param receiver
     */
    purchase: async (
      paymentMethod: PaymentMethod,
      name: string,
      nameLength: number,
      duration: number = 1,
      metadataURL: string,
      authorityAddress: string,
      signature: string,
      receiver?: string
    ): Promise<ContractTransaction> => {
      const to = receiver || (await this.masaConfig.wallet.getAddress());

      const domain: TypedDataDomain = await generateSignatureDomain(
        this.masaConfig.wallet as Wallet,
        "SoulStore",
        this.instances.SoulStoreContract.address
      );

      const value: {
        to: string;
        name: string;
        nameLength: number;
        yearsPeriod: number;
        tokenURI: string;
      } = {
        to,
        name,
        nameLength,
        yearsPeriod: duration,
        tokenURI: metadataURL,
      };

      await this.tools.verify(
        "Verifying soul name failed!",
        this.instances.SoulStoreContract,
        domain,
        this.soulName.types,
        value,
        signature,
        authorityAddress
      );

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
        number, // nameLength: PromiseOrValue<BigNumberish>
        number, // yearsPeriod: PromiseOrValue<BigNumberish>
        string, // tokenURI: PromiseOrValue<string>
        string, // authorityAddress: PromiseOrValue<string>
        string // signature: PromiseOrValue<BytesLike>
      ] = [
        paymentAddress,
        to,
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
      const soulStore = this.instances.SoulStoreContract.connect(
        this.masaConfig.wallet
      );

      // estimate gas
      const gasLimit = await soulStore.estimateGas.purchaseName(
        ...purchaseNameParameters,
        purchaseNameOverrides
      );

      // execute
      return await soulStore.purchaseName(...purchaseNameParameters, {
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
          price = this.tools.addSlippage(price, slippage);
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

    /**
     * signs a soul name
     * @param soulName
     * @param soulNameLength
     * @param duration
     * @param metadataUrl
     * @param receiver
     */
    sign: async (
      soulName: string,
      soulNameLength: number,
      duration: number,
      metadataUrl: string,
      receiver: string
    ): Promise<
      | {
          signature: string;
          authorityAddress: string;
        }
      | undefined
    > => {
      const value: {
        to: string;
        name: string;
        nameLength: number;
        yearsPeriod: number;
        tokenURI: string;
      } = {
        to: receiver,
        name: soulName,
        nameLength: soulNameLength,
        yearsPeriod: duration,
        tokenURI: metadataUrl,
      };

      const { signature, domain } = await signTypedData(
        this.instances.SoulStoreContract,
        this.masaConfig.wallet as Wallet,
        "SoulStore",
        this.soulName.types,
        value
      );

      const authorityAddress = await this.masaConfig.wallet.getAddress();

      await this.tools.verify(
        "Signing soul name failed!",
        this.instances.SoulStoreContract,
        domain,
        this.soulName.types,
        value,
        signature,
        authorityAddress
      );

      return { signature, authorityAddress };
    },
  };

  identity = {
    /**
     * purchase only identity
     */
    purchase: async (): Promise<ContractTransaction> => {
      return await this.instances.SoulStoreContract.connect(
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
      const domain: TypedDataDomain = await generateSignatureDomain(
        this.masaConfig.wallet as Wallet,
        "SoulStore",
        this.instances.SoulStoreContract.address
      );

      const value: {
        to: string;
        name: string;
        nameLength: number;
        yearsPeriod: number;
        tokenURI: string;
      } = {
        to: await this.masaConfig.wallet.getAddress(),
        name,
        nameLength,
        yearsPeriod: duration,
        tokenURI: metadataURL,
      };

      await this.tools.verify(
        "Verifying soul name failed!",
        this.instances.SoulStoreContract,
        domain,
        this.soulName.types,
        value,
        signature,
        authorityAddress
      );

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
        number, // nameLength: PromiseOrValue<BigNumberish>
        number, // yearsPeriod: PromiseOrValue<BigNumberish>
        string, // tokenURI: PromiseOrValue<string>
        string, // authorityAddress: PromiseOrValue<string>
        string //signature: PromiseOrValue<BytesLike>
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
      const soulStore = this.instances.SoulStoreContract.connect(
        this.masaConfig.wallet
      );

      // estimate gas
      const gasLimit = await soulStore.estimateGas.purchaseIdentityAndName(
        ...purchaseIdentityAndNameParameters,
        purchaseIdentityAndNameOverrides
      );

      // execute tx
      return await soulStore.purchaseIdentityAndName(
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
     * gets the price for a credit score
     * @param paymentMethod
     * @param slippage
     */
    getPrice: async (
      paymentMethod: PaymentMethod,
      // slippage in bps where 10000 is 100%. 250 would be 2,5%
      slippage: number | undefined = 250
    ): Promise<{
      price: BigNumber;
      paymentAddress: string;
      formattedPrice: string;
    }> => {
      const paymentAddress = this.tools.getPaymentAddress(paymentMethod);

      let price =
        await this.instances.SoulboundCreditScoreContract.getMintPrice(
          paymentAddress
        );

      if (slippage) {
        if (paymentMethod === "eth") {
          price = this.tools.addSlippage(price, slippage);
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
      const value: {
        identityId: BigNumber;
        authorityAddress: string;
        signatureDate: number;
      } = {
        identityId,
        authorityAddress,
        signatureDate,
      };

      const domain: TypedDataDomain = await generateSignatureDomain(
        this.masaConfig.wallet as Wallet,
        "SoulboundCreditScore",
        this.instances.SoulboundCreditScoreContract.address
      );

      await this.tools.verify(
        "Verifying credit score failed!",
        this.instances.SoulboundCreditScoreContract,
        domain,
        this.creditScore.types,
        value,
        signature,
        authorityAddress
      );

      const { price, paymentAddress } = await this.creditScore.getPrice(
        paymentMethod,
        slippage
      );

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

      await this.tools.verify(
        "Signing credit score failed!",
        this.instances.SoulboundCreditScoreContract,
        domain,
        this.creditScore.types,
        value,
        signature,
        authorityAddress
      );

      return { signature, signatureDate, authorityAddress };
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
          price = this.tools.addSlippage(price, slippage);
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
        authorityAddress,
        signatureDate,
      };

      const domain: TypedDataDomain = await generateSignatureDomain(
        this.masaConfig.wallet as Wallet,
        "SoulboundGreen",
        this.instances.SoulboundGreenContract.address
      );

      await this.tools.verify(
        "Verifying green failed!",
        this.instances.SoulboundGreenContract,
        domain,
        this.green.types,
        value,
        signature,
        authorityAddress
      );

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

      await this.tools.verify(
        "Signing green failed!",
        this.instances.SoulboundGreenContract,
        domain,
        this.green.types,
        value,
        signature,
        authorityAddress
      );

      return { signature, signatureDate, authorityAddress };
    },
  };
}
