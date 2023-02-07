import axios, { AxiosInstance } from "axios";
import {
  BaseResult,
  ICreditScore,
  IGreen,
  IIdentity,
  ISession,
} from "../../interface";
import Transaction from "arweave/node/lib/transaction";

const headers = {
  "Content-Type": "application/json",
};

export class MasaClient {
  private _middlewareClient: AxiosInstance;
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

  session = {
    /**
     * Check session is still alive
     */
    check: async (): Promise<ISession | undefined> => {
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
    },

    /**
     *
     * @param address
     * @param signature
     * @param cookie
     */
    checkSignature: async (
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
    },

    /**
     * Get challenge
     */
    getChallenge: async (): Promise<
      | {
          challenge: string;
          expires: string;
          cookie?: string;
        }
      | undefined
    > => {
      const getChallengeResponse = await this._middlewareClient
        .get(`/session/get-challenge`)
        .catch((err: any) => {
          console.error("Get Challenge failed!", err.message);
        });

      if (getChallengeResponse) {
        const cookies = getChallengeResponse.headers["set-cookie"];

        let cookie;
        if (!cookies || cookies.length < 1) {
          console.warn("No cookies in response!");
        } else {
          cookie = cookies[0];
        }

        const { data: challengeData } = getChallengeResponse;

        return {
          ...challengeData,
          cookie,
        };
      }
    },

    logout: async (): Promise<
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
    },
  };

  metadata = {
    /**
     * Retrieve metadata
     * @param uri
     * @param additionalHeaders
     */
    get: async (
      uri: string,
      additionalHeaders?: Record<string, string>
    ): Promise<IIdentity | ICreditScore | IGreen | undefined> => {
      const headers = {
        cookie: this.cookie ? [this.cookie] : undefined,
        ...additionalHeaders,
      };

      const metadataResponse = await this._middlewareClient
        .get(uri, {
          headers,
        })
        .catch((err) => {
          console.error("Failed to load Metadata!", err.message, uri);
        });

      if (metadataResponse) {
        const { data: metadata } = metadataResponse;
        return metadata;
      }
    },
  };

  soulName = {
    /**
     * Store metadata
     * @param soulName
     * @param receiver
     * @param duration
     */
    store: async (
      soulName: string,
      receiver: string,
      duration: number
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
          // signature from the authority to be verified in the contract
          signature: string;
          // signer address
          authorityAddress: string;
        }
      | undefined
    > => {
      console.log(`Writing metadata for '${soulName}.soul'`);

      const storeMetadataResponse = await this._middlewareClient
        .post(
          `/storage/store`,
          {
            soulName: `${soulName}.soul`,
            receiver,
            duration,
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
    },
  };

  green = {
    /**
     * Generates a new masa green request
     * @param phoneNumber
     */
    generate: async (
      phoneNumber: string
    ): Promise<
      | (BaseResult & {
          channel?: string;
          status: string;
          errorCode?: number;
        })
      | undefined
    > => {
      const result = {
        success: false,
        status: "failed",
        message: "Generating green failed",
      };

      const greenGenerateResponse = await this._middlewareClient
        .post<
          BaseResult & {
            channel?: string;
            status: string;
            code?: number;
          }
        >(
          `/green/generate`,
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
          console.error("Generating green failed!", err.message);
        });

      if (
        greenGenerateResponse &&
        greenGenerateResponse.status === 200 &&
        greenGenerateResponse.data
      ) {
        result.success = true;
        result.message = "";
        result.status = "success";
        return { ...result, ...greenGenerateResponse.data };
      } else {
        const message = `Generating green failed! ${result.message}`;
        console.error(message);

        return {
          success: false,
          status: "failed",
          message,
        };
      }
    },

    verify: async (
      phoneNumber: string,
      code: string,
      network: string
    ): Promise<
      | (BaseResult & {
          status?: string;
          signature?: string;
          signatureDate?: number;
          authorityAddress?: string;
          errorCode?: number;
        })
      | undefined
    > => {
      const result = {
        success: false,
        status: "failed",
        message: "Verifying green failed",
      };

      const greenVerifyResponse = await this._middlewareClient
        .post<
          BaseResult & {
            status?: string;
            signature?: string;
            signatureDate?: number;
            authorityAddress?: string;
            errorCode?: number;
          }
        >(
          `/green/verify`,
          {
            phoneNumber,
            code,
            network,
          },
          {
            headers: {
              cookie: this.cookie ? [this.cookie] : undefined,
            },
          }
        )
        .catch((err: any) => {
          console.error("Verifying gree failed!", err.message);
        });

      if (
        greenVerifyResponse &&
        greenVerifyResponse.status === 200 &&
        greenVerifyResponse.data
      ) {
        result.success = true;
        result.message = "";
        result.status = "success";
        return { ...result, ...greenVerifyResponse.data };
      } else {
        const message = `Verifying green failed! ${result.message}`;
        console.error(message);

        return {
          success: false,
          status: "failed",
          message,
        };
      }
    },
  };

  creditScore = {
    /**
     * Generates a new credit score
     */
    create: async (): Promise<
      | {
          success: boolean;
          status: string;
          message: string;
          signature?: string;
          signatureDate?: number;
          authorityAddress?: string;
        }
      | undefined
    > => {
      const result = {
        success: false,
        status: "failed",
        message: "Credit Score failed",
      };

      const generateCreditScoreResponse = await this._middlewareClient
        .get(`/credit-score/generate`, {
          headers: {
            cookie: this.cookie ? [this.cookie] : undefined,
          },
        })
        .catch((err: any) => {
          console.error("Generation of credit score failed!", err.message);
        });

      if (
        generateCreditScoreResponse &&
        generateCreditScoreResponse.status === 200 &&
        generateCreditScoreResponse.data
      ) {
        result.success = true;
        result.message = "";
        result.status = "success";
        return { ...result, ...generateCreditScoreResponse.data };
      } else {
        console.error("Generation of credit score failed!");
        return {
          success: false,
          status: "failed",
          message: "Credit Score failed",
        };
      }
    },

    /**
     * Update an existing credit score
     * @param transactionHash
     */
    update: async (
      transactionHash: string
    ): Promise<
      | {
          success: boolean;
          status: string;
          message: string;
          signature?: string;
        }
      | undefined
    > => {
      const result = {
        success: false,
        status: "failed",
        message: "Credit Score failed",
      };

      const updateCreditScoreResponse = await this._middlewareClient
        .post(
          `/credit-score/update`,
          {
            transactionHash,
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

      if (
        updateCreditScoreResponse?.status === 200 &&
        updateCreditScoreResponse?.data
      ) {
        result.success = true;
        result.message = "";
        result.status = "success";
        return { ...result, ...updateCreditScoreResponse.data };
      } else {
        console.error("Generation of credit score failed!");
      }

      return result;
    },
  };
}
