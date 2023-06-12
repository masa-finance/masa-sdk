import type { LogDescription } from "@ethersproject/abi";
import type { BigNumber } from "@ethersproject/bignumber";
import type { ReferenceSBTSelfSovereign } from "@masa-finance/masa-contracts-identity";
import type { PayableOverrides, TypedDataDomain, TypedDataField } from "ethers";

import { Messages } from "../../../../collections";
import type { PaymentMethod } from "../../../../interface";
import { generateSignatureDomain, signTypedData } from "../../../../utils";
import { SBT } from "../SBT";
import type { SSSBTContractWrapper } from "./SSSBTContractWrapper";

export class SSSBT<
  Contract extends ReferenceSBTSelfSovereign
> extends SBT<Contract> {
  protected wrapper = (
    sbtContract: Contract
  ): SSSBTContractWrapper<Contract> => ({
    ...super.wrapper(sbtContract),

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
    ): Promise<{
      signature: string;
      authorityAddress: string;
    }> => {
      const authorityAddress = await this.masa.config.signer.getAddress();

      const { signature, domain } = await signTypedData(
        sbtContract,
        this.masa.config.signer,
        name,
        types,
        value
      );

      await this.verify(
        "Signing SBT failed!",
        sbtContract,
        domain,
        types,
        value,
        signature,
        authorityAddress
      );

      return { signature, authorityAddress };
    },

    /**
     *
     * @param paymentMethod
     * @param name
     * @param types
     * @param value
     * @param signature
     * @param authorityAddress
     * @param slippage
     */
    prepareMint: async (
      paymentMethod: PaymentMethod,
      name: string,
      types: Record<string, Array<TypedDataField>>,
      value: Record<string, string | BigNumber | number>,
      signature: string,
      authorityAddress: string,
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
      const domain: TypedDataDomain = await generateSignatureDomain(
        this.masa.config.signer,
        name,
        sbtContract.address
      );

      await this.verify(
        "Verifying SBT failed!",
        sbtContract,
        domain,
        types,
        value,
        signature,
        authorityAddress
      );

      const { getPrice } = this.attach(sbtContract);
      const priceInfo = await getPrice(paymentMethod, slippage);

      if (this.masa.config.verbose) {
        console.info({ priceInfo });
      }

      return priceInfo;
    },

    /**
     *
     * @param paymentMethod
     * @param receiver
     * @param signature
     * @param signatureDate
     * @param authorityAddress
     */
    mint: async (
      paymentMethod: PaymentMethod,
      receiver: string,
      signature: string,
      signatureDate: number,
      authorityAddress: string
    ) => {
      const { getPrice, prepareMint } = this.attach(sbtContract);

      const types = {
        Mint: [
          { name: "to", type: "address" },
          { name: "authorityAddress", type: "address" },
          { name: "signatureDate", type: "uint256" },
        ],
      };

      // fill the collection with data
      const value: {
        to: string;
        authorityAddress: string;
        signatureDate: number;
      } = {
        to: receiver,
        authorityAddress,
        signatureDate,
      };

      const prepareMintResults = await prepareMint(
        paymentMethod,
        "ReferenceSBTSelfSovereign",
        types,
        value,
        signature,
        authorityAddress
      );

      const { price, paymentAddress } = await getPrice(paymentMethod);

      const mintSSSBTArguments: [
        string, // paymentMethod string
        string, // to string
        string, // authorityAddress string
        number, // authorityAddress number
        string // signature string
      ] = [
        paymentAddress,
        receiver,
        authorityAddress,
        signatureDate,
        signature,
      ];

      const mintSSSBTOverrides: PayableOverrides = {
        value: price.gt(0) ? price : undefined,
      };

      if (this.masa.config.verbose) {
        console.info(mintSSSBTArguments, prepareMintResults);
      }

      const {
        "mint(address,address,address,uint256,bytes)": mint,
        estimateGas: {
          "mint(address,address,address,uint256,bytes)": estimateGas,
        },
      } = sbtContract;

      let gasLimit: BigNumber = await estimateGas(
        ...mintSSSBTArguments,
        mintSSSBTOverrides
      );

      if (this.masa.config.network?.gasSlippagePercentage) {
        gasLimit = SSSBT.addSlippage(
          gasLimit,
          this.masa.config.network.gasSlippagePercentage
        );
      }

      const { wait, hash } = await mint(...mintSSSBTArguments, {
        ...mintSSSBTOverrides,
        gasLimit,
      });

      console.log(Messages.WaitingToFinalize(hash));

      const { logs } = await wait();

      const parsedLogs = this.masa.contracts.parseLogs(logs, [sbtContract]);

      const mintEvent = parsedLogs.find(
        (log: LogDescription) => log.name === "Mint"
      );

      if (mintEvent) {
        const { args } = mintEvent;
        console.log(
          `Minted to token with ID: ${args._tokenId} receiver '${args._owner}'`
        );

        return true;
      }

      return false;
    },
  });

  /**
   * attaches the contract function to an existing instances
   * @param sbtContract
   */
  attach = (sbtContract: Contract): SSSBTContractWrapper<Contract> => {
    return this.wrapper(sbtContract);
  };
}
