import { BigNumber } from "@ethersproject/bignumber";
import { TypedDataField } from "ethers";

import { Messages } from "../../collections";
import type { BaseResult } from "../../interface";
import { MasaContractModuleBase } from "./masa-contract-module-base";
import { isSigner } from "../../utils"

export class SoulName extends MasaContractModuleBase {
  /**
   *
   */
  public readonly types: Record<string, Array<TypedDataField>> = {
    MintSoulName: [
      { name: "to", type: "address" },
      { name: "name", type: "string" },
      { name: "nameLength", type: "uint256" },
      { name: "yearsPeriod", type: "uint256" },
      { name: "tokenURI", type: "string" },
    ],
  };

  /**
   * Returns detailed information for a soul name
   * @param soulName
   */
  public getSoulnameData = async (
    soulName: string,
  ): Promise<{ exists: boolean; tokenId: BigNumber }> => {
    return await this.instances.SoulNameContract.nameData(
      soulName.toLowerCase(),
    );
  };

  /**
   *
   * @param soulName
   * @param receiver
   */
  public transfer = async (
    soulName: string,
    receiver: string,
  ): Promise<BaseResult> => {
    const result: BaseResult = { success: false };

    const [soulNameData, extension] = await Promise.all([
      this.getSoulnameData(soulName),
      this.masa.contracts.instances.SoulNameContract.extension(),
    ]);

    if (soulNameData.exists && isSigner(this.masa.config.signer)) {
      console.log(
        `Sending '${soulName}${extension}' with token ID '${soulNameData.tokenId}' to '${receiver}'!`,
      );

      const {
        transferFrom,
        estimateGas: { transferFrom: estimateGas },
      } = this.masa.contracts.instances.SoulNameContract;

      try {
        const transferFromArguments: [string, string, BigNumber] = [
          await this.masa.config.signer.getAddress(),
          receiver,
          soulNameData.tokenId,
        ];

        const gasLimit = await this.estimateGasWithSlippage(
          estimateGas,
          transferFromArguments,
        );

        const { wait, hash } = await transferFrom(...transferFromArguments, {
          gasLimit,
        });

        console.log(
          Messages.WaitingToFinalize(
            hash,
            this.masa.config.network?.blockExplorerUrls?.[0],
          ),
        );

        await wait();

        console.log(
          `Soulname '${soulName}${extension}' with token ID '${soulNameData.tokenId}' sent!`,
        );

        result.success = true;
      } catch (error: unknown) {
        if (error instanceof Error) {
          result.message = `Sending of Soul Name Failed! ${error.message}`;
          console.error(result.message);
        }
      }
    } else {
      result.message = `Soulname '${soulName}${extension}' does not exist!`;
      console.error(result.message);
    }

    return result;
  };

  /**
   *
   * @param soulName
   */
  public burn = async (soulName: string): Promise<BaseResult> => {
    const result: BaseResult = {
      success: false,
    };

    const [soulNameData, extension] = await Promise.all([
      this.getSoulnameData(soulName),
      this.masa.contracts.instances.SoulNameContract.extension(),
    ]);

    if (soulNameData.exists) {
      console.log(
        `Burning '${soulName}${extension}' with token ID '${soulNameData.tokenId}'!`,
      );

      const {
        estimateGas: { burn: estimateGas },
        burn,
      } = this.masa.contracts.instances.SoulNameContract;

      try {
        // estimate gas
        const gasLimit = await this.estimateGasWithSlippage(estimateGas, [
          soulNameData.tokenId,
        ]);

        const { wait, hash } = await burn(soulNameData.tokenId, {
          gasLimit,
        });

        console.log(
          Messages.WaitingToFinalize(
            hash,
            this.masa.config.network?.blockExplorerUrls?.[0],
          ),
        );

        await wait();

        console.log(
          `Burned Soulname '${soulName}${extension}' with ID '${soulNameData.tokenId}'!`,
        );

        result.success = true;
      } catch (error: unknown) {
        if (error instanceof Error) {
          result.message = `Burning Soulname '${soulName}${extension}' Failed! ${error.message}`;
          console.error(result.message);
        }
      }
    } else {
      result.message = `Soulname '${soulName}${extension}' does not exist!`;
      console.error(result.message);
    }

    return result;
  };

  /**
   *
   * @param soulName
   * @param years
   */
  public renew = async (
    soulName: string,
    years: number,
  ): Promise<BaseResult> => {
    const result: BaseResult = { success: false };

    const tokenId =
      await this.masa.contracts.instances.SoulNameContract.getTokenId(soulName);

    const {
      renewYearsPeriod,
      estimateGas: { renewYearsPeriod: estimateGas },
    } = this.masa.contracts.instances.SoulNameContract;

    try {
      const gasLimit = await this.estimateGasWithSlippage(estimateGas, [
        tokenId,
        years,
      ]);

      const { wait, hash } = await renewYearsPeriod(tokenId, years, {
        gasLimit,
      });

      console.log(
        Messages.WaitingToFinalize(
          hash,
          this.masa.config.network?.blockExplorerUrls?.[0],
        ),
      );

      await wait();
      result.success = true;
    } catch (error: unknown) {
      if (error instanceof Error) {
        result.message = `renewal failed! ${error.message}`;
        console.error(result.message);
      }
    }

    return result;
  };
}
