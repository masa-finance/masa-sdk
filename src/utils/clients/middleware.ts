import axios from "axios";
import { I2FA, ICreditReport, IIdentity } from "../../interface";
import { BigNumber } from "ethers";
import Transaction from "arweave/node/lib/transaction";

const headers = {
  "Content-Type": "application/json",
};

export class MasaClient {
  private middlewareClient;
  public cookie?: string;

  constructor({ apiUrl, cookie }: { apiUrl: string; cookie?: string }) {
    this.cookie = cookie;

    this.middlewareClient = axios.create({
      baseURL: apiUrl,
      withCredentials: true,
      headers,
    });
  }

  sessionCheck = async (): Promise<any | undefined> => {
    const checkResponse = await this.middlewareClient
      .get(`/session/check`, {
        headers: {
          cookie: this.cookie ? [this.cookie] : undefined,
        },
      })
      .catch(() => {
        // ignore
      });

    if (checkResponse) {
      const { data: checkData } = checkResponse;

      return checkData;
    }
  };

  getMetadata = async (
    uri: string
  ): Promise<IIdentity | ICreditReport | I2FA | undefined> => {
    const metadataResponse = await this.middlewareClient.get(uri, {
      headers: {
        cookie: this.cookie ? [this.cookie] : undefined,
      },
    });

    if (metadataResponse) {
      const { data: metadata } = metadataResponse;
      return metadata;
    }
  };

  storeMetadata = async (
    soulName: string
  ): Promise<
    | {
        // image info
        imageTransaction: Transaction;
        imageResponse: {
          status: number;
          statusText: string;
          data: any;
        };
        // metadata info
        metadataTransaction: Transaction;
        metadataResponse: {
          status: number;
          statusText: string;
          data: any;
        };
      }
    | undefined
  > => {
    const storeMetadataResponse = await this.middlewareClient
      .post(
        `/storage/store`,
        {
          soulName: `${soulName}.soul`,
        },
        {
          headers: {
            cookie: this.cookie ? [this.cookie] : undefined,
          },
        }
      )
      .catch((err: any) => {
        console.error("Storing metadata failed!", err.message);
      });

    if (storeMetadataResponse) {
      const { data: storeMetadataData } = storeMetadataResponse;
      return storeMetadataData;
    }
  };

  getChallenge = async (): Promise<any | undefined> => {
    const getChallengeResponse = await this.middlewareClient
      .get(`/session/get-challenge`)
      .catch((err: any) => {
        console.error("Get Challenge failed!", err.message);
      });

    if (getChallengeResponse) {
      const cookie = getChallengeResponse.headers["set-cookie"];

      if (!cookie) console.warn("No cookie in response!");

      const { data: challengeData } = getChallengeResponse;

      return {
        ...challengeData,
        cookie,
      };
    }
  };

  checkSignature = async (
    address: string,
    signature: string,
    cookie?: string
  ): Promise<any | undefined> => {
    const cookieToUse = cookie || this.cookie;

    const checkSignatureResponse = await this.middlewareClient
      .post(
        `/session/check-signature`,
        {
          address,
          signature,
        },
        {
          headers: {
            cookie: cookieToUse ? [cookieToUse] : undefined,
          },
        }
      )
      .catch((err: any) => {
        console.error("Check signature failed!", err.message);
      });

    if (checkSignatureResponse) {
      const { data: checkSignatureData } = checkSignatureResponse;

      return checkSignatureData;
    }
  };

  creditScoreMint = async (
    address: string,
    signature: string
  ): Promise<
    | {
        tokenId: string | BigNumber;
        success: boolean;
        message: string;
      }
    | undefined
  > => {
    const storeMetadataResponse = await this.middlewareClient
      .post(
        `/contracts/credit-score/mint`,
        {
          address,
          signature,
        },
        {
          headers: {
            cookie: this.cookie ? [this.cookie] : undefined,
          },
        }
      )
      .catch((err: any) => {
        console.error("Minting Credit Score failed!", err.message);
      });

    if (storeMetadataResponse) {
      const {
        data: { success, message, tokenId },
      } = storeMetadataResponse;

      return {
        tokenId,
        success,
        message,
      };
    }
  };

  twoFAMint = async (
    address: string,
    phoneNumber: string,
    code: string,
    signature: string
  ): Promise<
    | {
        tokenId: string | BigNumber;
        success: boolean;
        status: string;
        message: string;
      }
    | undefined
  > => {
    const mint2FAResponse = await this.middlewareClient
      .post(
        `/2fa/mint`,
        {
          address,
          phoneNumber,
          code,
          signature,
        },
        {
          headers: {
            cookie: this.cookie ? [this.cookie] : undefined,
          },
        }
      )
      .catch((err: any) => {
        console.error("Minting 2FA failed!", err.message);
      });

    if (mint2FAResponse) {
      const {
        data: { success, message, tokenId, status },
      } = mint2FAResponse;

      return {
        tokenId,
        status,
        success,
        message,
      };
    }
  };

  twoFAGenerate = async (
    phoneNumber: string
  ): Promise<
    | {
        success: boolean;
        status: string;
        message: string;
      }
    | undefined
  > => {
    const storeMetadataResponse = await this.middlewareClient
      .post(
        `/2fa/generate`,
        {
          phoneNumber,
        },
        {
          headers: {
            cookie: this.cookie ? [this.cookie] : undefined,
          },
        }
      )
      .catch((err: any) => {
        console.error("Generating 2FA failed!", err.message);
      });

    if (storeMetadataResponse) {
      const {
        data: { success, message, status },
      } = storeMetadataResponse;

      return {
        success,
        status,
        message,
      };
    }
  };

  sessionLogout = async (): Promise<
    | {
        status: string;
      }
    | undefined
  > => {
    const logoutResponse = await this.middlewareClient
      .post(`/session/logout`, undefined, {
        headers: {
          cookie: this.cookie ? [this.cookie] : undefined,
        },
      })
      .catch((err: any) => {
        console.error("Logout failed!,", err.message);
      });

    if (logoutResponse) {
      const { data: logoutData } = logoutResponse;
      return logoutData;
    }
  };
}
