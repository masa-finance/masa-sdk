import type { LogDescription } from "@ethersproject/abi";
import type { ReferenceSBTAuthority } from "@masa-finance/masa-contracts-identity";
import type { BigNumber, PayableOverrides } from "ethers";

import { Messages } from "../../../../collections";
import type {
  IIdentityContracts,
  MasaInterface,
  PaymentMethod,
} from "../../../../interface";
import { SBTContract } from "../SBT";
import { ASBTContractWrapper } from "./asbt-contract-wrapper";

export class ASBTContract<
  Contract extends ReferenceSBTAuthority
> extends SBTContract<Contract> {
  constructor(masa: MasaInterface, instances: IIdentityContracts) {
    super(masa, instances);

    this.wrapper.bind(this);
  }

  /**
   *
   * @param sbtContract
   */
  protected wrapper(sbtContract: Contract): ASBTContractWrapper<Contract> {
    return {
      ...super.wrapper(sbtContract),

      /**
       *
       * @param paymentMethod
       * @param receiver
       */
      mint: async (paymentMethod: PaymentMethod, receiver: string) => {
        const { getPrice } = await this.masa.contracts.asbt.attach(sbtContract);

        // current limit for ASBT is 1 on the default installation
        let limit: number = 1;

        try {
          limit = (await sbtContract.maxSBTToMint()).toNumber();
        } catch {
          if (this.masa.config.verbose) {
            console.info("Loading limit failed, falling back to 1!");
          }
        }

        const balance: BigNumber = await sbtContract.balanceOf(receiver);

        if (limit > 0 && balance.gte(limit)) {
          console.error(
            `Minting of ASBT failed: '${receiver}' exceeded the limit of '${limit}'!`
          );
          return false;
        }

        const { price, paymentAddress } = await getPrice(paymentMethod);

        const mintASBTArguments: [
          string, // paymentAddress string
          string // receiver string
        ] = [paymentAddress, receiver];

        const mintASBTOverrides: PayableOverrides = {
          value: price.gt(0) ? price : undefined,
        };

        if (this.masa.config.verbose) {
          console.info(mintASBTArguments, mintASBTOverrides);
        }

        const {
          "mint(address,address)": mint,
          estimateGas: { "mint(address,address)": estimateGas },
        } = sbtContract;

        let gasLimit: BigNumber = await estimateGas(
          ...mintASBTArguments,
          mintASBTOverrides
        );

        if (this.masa.config.network?.gasSlippagePercentage) {
          gasLimit = ASBTContract.addSlippage(
            gasLimit,
            this.masa.config.network.gasSlippagePercentage
          );
        }

        const { wait, hash } = await mint(...mintASBTArguments, {
          ...mintASBTOverrides,
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
    };
  }

  /**
   * attaches the contract function to an existing instances
   * @param sbtContract
   */
  attach = (sbtContract: Contract): ASBTContractWrapper<Contract> => {
    return this.wrapper(sbtContract);
  };
}
