import { MasaBase } from "../../helpers/masa-base";
import {
  IIdentityContracts,
  isERC20Currency,
  isNativeCurrency,
  MasaConfig,
  PaymentMethod,
} from "../../interface";
import { BigNumber } from "@ethersproject/bignumber";
import {
  constants,
  ContractReceipt,
  Signer,
  TypedDataDomain,
  TypedDataField,
  utils,
} from "ethers";
import { ERC20, ERC20__factory } from "../stubs";
import { Messages } from "../../utils";
import {
  MasaSBT,
  MasaSBTAuthority,
  MasaSBTSelfSovereign,
  SoulLinker,
  SoulStore,
} from "@masa-finance/masa-contracts-identity";
import { verifyTypedData } from "ethers/lib/utils";
import Masa from "../../masa";

export class ContractFactory {
  static connect: <Contract>(
    address: string,
    signerOrProvider: Signer
  ) => Contract;
}

export class MasaModuleBase extends MasaBase {
  constructor(masa: Masa, protected instances: IIdentityContracts) {
    super(masa);
  }

  /**
   * Checks or gives allowance on ERC20 tokens
   * @param paymentAddress
   * @param paymentMethod
   * @param spenderAddress
   * @param price
   * @private
   */
  protected checkOrGiveAllowance = async (
    paymentAddress: string,
    paymentMethod: PaymentMethod,
    spenderAddress: string,
    price: BigNumber
  ): Promise<ContractReceipt | undefined> => {
    if (isERC20Currency(paymentMethod)) {
      const contract: ERC20 = ERC20__factory.connect(
        paymentAddress,
        this.masa.config.signer
      );

      // get current allowance
      const currentAllowance = await contract.allowance(
        // owner
        await this.masa.config.signer.getAddress(),
        // spender
        spenderAddress
      );

      // is price greater the allowance?
      if (price.gt(currentAllowance)) {
        // yes, lets set the allowance to the price

        if (this.masa.config.verbose) {
          console.info(
            `Creating allowance for ${spenderAddress}: ${price.toString()}`
          );
        }

        const { wait, hash } = await contract
          .connect(this.masa.config.signer)
          .approve(
            // spender
            spenderAddress,
            // amount
            price
          );

        if (this.masa.config.verbose) {
          console.info(Messages.WaitingToFinalize(hash));
        }

        return await wait();
      }
    }
  };

  /**
   * Gets the payment address for a given payment method
   * @param paymentMethod
   * @private
   */
  public getPaymentAddress = (paymentMethod: PaymentMethod): string => {
    let paymentAddress: string | undefined = isNativeCurrency(paymentMethod)
      ? constants.AddressZero
      : this.masa.config.network?.addresses?.tokens?.[paymentMethod];

    if (!paymentAddress) {
      console.error(
        `Payment address not found for payment method: ${paymentMethod} falling back to native currency!`
      );
      paymentAddress = constants.AddressZero;
    }

    return paymentAddress;
  };

  /**
   *
   * @param paymentAddress
   * @param price
   */
  protected formatPrice = async (paymentAddress: string, price: BigNumber) => {
    let decimals = 18;
    if (paymentAddress !== constants.AddressZero) {
      const contract: ERC20 = ERC20__factory.connect(
        paymentAddress,
        this.masa.config.signer
      );
      decimals = await contract.decimals();
    }

    return utils.formatUnits(price, decimals);
  };

  /**
   * adds a percentage to the price as slippage
   * @param price
   * @param slippage
   */
  protected addSlippage = (price: BigNumber, slippage: number) => {
    price = price.add(price.mul(slippage).div(10000));
    return price;
  };

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
  protected verify = async (
    errorMessage: string,
    contract:
      | MasaSBT
      | MasaSBTSelfSovereign
      | MasaSBTAuthority
      | SoulStore
      | SoulLinker,
    domain: TypedDataDomain,
    types: Record<string, Array<TypedDataField>>,
    value: Record<string, string | BigNumber | number>,
    signature: string,
    authorityAddress: string
  ) => {
    if (this.masa.config.verbose) {
      console.log({
        domain,
        types: JSON.stringify(types),
        value,
        signature,
        authorityAddress,
      });
    }

    const hasAuthorities = (
      contract:
        | MasaSBT
        | MasaSBTSelfSovereign
        | MasaSBTAuthority
        | SoulStore
        | SoulLinker
    ): contract is MasaSBTSelfSovereign => {
      return (contract as MasaSBTSelfSovereign).authorities !== undefined;
    };

    // first line of defense, check that the address properly recovers
    const recoveredAddress = verifyTypedData(domain, types, value, signature);

    if (this.masa.config.verbose) {
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

      if (this.masa.config.verbose) {
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
  };

  /**
   *
   * @param paymentMethod
   * @param contract
   * @param slippage
   */
  protected getMintPrice = async (
    paymentMethod: PaymentMethod,
    contract: MasaSBTSelfSovereign | MasaSBTAuthority | MasaSBT,
    // slippage in bps where 10000 is 100%. 250 would be 2,5%
    slippage: number | undefined = 250
  ): Promise<{
    paymentAddress: string;
    price: BigNumber;
    formattedPrice: string;
    mintFee: BigNumber;
    formattedMintFee: string;
    protocolFee: BigNumber;
    formattedProtocolFee: string;
  }> => {
    const paymentAddress = this.getPaymentAddress(paymentMethod);

    let mintFee: BigNumber | undefined,
      protocolFee: BigNumber = BigNumber.from(0);
    try {
      // load protocol and mint fee
      const fees = await contract.getMintPriceWithProtocolFee(paymentAddress);
      mintFee = fees.price;
      protocolFee = fees.protocolFee;
    } catch {
      // ignore this is a soul store 2.0 function and does not work on older contracts
    }

    if (!mintFee) {
      // fallback to classical price calculation
      mintFee = await contract.getMintPrice(paymentAddress);
    }

    // calculate total price
    let price = mintFee.add(protocolFee);

    if (slippage) {
      if (isNativeCurrency(paymentMethod)) {
        price = this.addSlippage(price, slippage);
      }
    }

    // total price
    const formattedPrice = await this.formatPrice(paymentAddress, price);

    // mint fee
    const formattedMintFee = await this.formatPrice(paymentAddress, mintFee);

    // protocol fee
    const formattedProtocolFee = await this.formatPrice(
      paymentAddress,
      protocolFee
    );

    return {
      paymentAddress,
      price,
      formattedPrice,
      mintFee,
      formattedMintFee,
      protocolFee,
      formattedProtocolFee,
    };
  };

  /**
   *
   * @param masaConfig
   * @param address
   * @param factory
   */
  protected loadSBTContract = async <
    Contract extends MasaSBTSelfSovereign | MasaSBTAuthority | MasaSBT
  >(
    masaConfig: MasaConfig,
    address: string,
    factory: ContractFactory
  ): Promise<Contract> => {
    let error = `Smart contract '${address}' does not exist on network '${masaConfig.networkName}'!`;

    // address invalid, unable to load
    if (!utils.isAddress(address)) {
      error = `Address '${address}' is not valid!`;
      console.error(error);
      throw new Error(error);
    }
    // fetch code to see if the contract exists
    const code: string | undefined = await masaConfig.signer.provider?.getCode(
      address
    );

    const contractExists: boolean = !!code && code !== "0x";

    // no code exists, unable to load
    if (!contractExists) {
      throw new Error(error);
    }

    const sbtContract = (factory as typeof ContractFactory).connect<Contract>(
      address,
      masaConfig.signer
    );

    // failed to load, unable to load
    if (!sbtContract) {
      console.error(error);
      throw new Error(error);
    } else if (masaConfig.verbose) {
      console.info(`Loaded contract with name: ${await sbtContract.name()}`);
    }

    return sbtContract;
  };
}
