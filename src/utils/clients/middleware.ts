import axios from "axios";
import { I2FA, ICreditScore, IIdentity, ISession } from "../../interface";
import { BigNumber } from "ethers";
import Transaction from "arweave/node/lib/transaction";

const headers = {
  "Content-Type": "application/json",
};

export class MasaClient {
  private _middlewareClient;
  private _cookie?: string;

  get cookie() {
    return this._cookie;
  }

  constructor({ apiUrl, cookie }: { apiUrl: string; cookie?: string }) {
    this._cookie = cookie;

    this._middlewareClient = axios.create({
      baseURL: apiUrl,
      withCredentials: true,
      headers,
    });
  }

  sessionCheck = async (): Promise<ISession | undefined> => {
    const checkResponse = await this._middlewareClient
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
  ): Promise<IIdentity | ICreditScore | I2FA | undefined> => {
    const metadataResponse = await this._middlewareClient
      .get(uri, {
        headers: {
          cookie: this.cookie ? [this.cookie] : undefined,
        },
      })
      .catch((err) => {
        console.error("Failed to load Metadata!", err.message, uri);
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
    const storeMetadataResponse = await this._middlewareClient
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
    const getChallengeResponse = await this._middlewareClient
      .get(`/session/get-challenge`)
      .catch((err: any) => {
        console.error("Get Challenge failed!", err.message);
      });

    if (getChallengeResponse) {
      const cookie = getChallengeResponse.headers["set-cookie"];

      if (!cookie) {
        console.warn("No cookie in response!");
      }

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

    const checkSignatureResponse = await this._middlewareClient
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

      // set the cookie here, so we can reuse it during the lifespan of the
      // masa object if it is not set yet
      if (cookie && !this.cookie) {
        this._cookie = cookie;
      }

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
    const storeMetadataResponse = await this._middlewareClient
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
    const mint2FAResponse = await this._middlewareClient
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
    const storeMetadataResponse = await this._middlewareClient
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

  listCreditScore = async (): Promise<any> => {
    const creditScoreResponse = await this._middlewareClient
      .get(`/contracts/credit-score`, {
        headers: {
          cookie: this.cookie ? [this.cookie] : undefined,
        },
      })
      .catch((err: any) => {
        console.error("Generation of credit score failed!", err.message);
      });

    if (creditScoreResponse?.status === 200 && creditScoreResponse?.data) {
      return creditScoreResponse.data;
    } else {
      console.error("Generation of credit score failed!");
      return {
        success: false,
        status: "failed",
        message: "Credit Score failed",
      };
    }
  };

  createCreditScore = async (
    address: string
  ): Promise<
    | {
        creditScore: any;
        signature: string;
      }
    | {
        success: boolean;
        status: string;
        message: string;
      }
    | undefined
  > => {
    const creditScoreResponse = await this._middlewareClient
      .post(
        `/contracts/credit-score/generate`,
        {
          address,
        },
        {
          headers: {
            cookie: this.cookie ? [this.cookie] : undefined,
          },
        }
      )
      .catch((err: any) => {
        console.error("Generation of credit score failed!", err.message);
      });

    if (creditScoreResponse?.status === 200 && creditScoreResponse?.data) {
      return creditScoreResponse.data;
    } else {
      console.error("Generation of credit score failed!");
      return {
        success: false,
        status: "failed",
        message: "Credit Score failed",
      };
    }
  };

  updateCreditScore = async (
    tx: any
  ): Promise<
    | {
        creditScore: any;
        signature: string;
      }
    | {
        success: boolean;
        status: string;
        message: string;
      }
    | undefined
  > => {
    const creditScoreResponse = await this._middlewareClient
      .post(
        `/contracts/credit-score/update`,
        {
          tx,
        },
        {
          headers: {
            cookie: this.cookie ? [this.cookie] : undefined,
          },
        }
      )
      .catch((err: any) => {
        console.error("Generation of credit score failed!", err.message);
      });

    if (creditScoreResponse?.status === 200 && creditScoreResponse?.data) {
      return creditScoreResponse.data;
    } else {
      console.error("Generation of credit score failed!");
      return {
        success: false,
        status: "failed",
        message: "Credit Score failed",
      };
    }
  };

  sessionLogout = async (): Promise<
    | {
        status: string;
      }
    | undefined
  > => {
    const logoutResponse = await this._middlewareClient
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
