import axios, { AxiosError, AxiosInstance } from "axios";
import {
  GenerateCreditScoreResult,
  GenerateGreenResult,
  GetChallengeResult,
  ICreditScore,
  IGreen,
  IIdentity,
  ISession,
  LogoutResult,
  SessionUser,
  SoulNameMetadataStoreResult,
  SoulNameResultBase,
  UpdateCreditScoreResult,
  VerifyGreenResult,
} from "../../interface";
import { MasaBase } from "../../helpers/masa-base";
import Masa from "../../masa";

const headers = {
  "Content-Type": "application/json",
};

export class MasaClient extends MasaBase {
  private _middlewareClient: AxiosInstance;
  private _cookie?: string;

  get cookie() {
    return this._cookie;
  }

  constructor({
    masa,
    apiUrl,
    cookie,
  }: {
    masa: Masa;
    apiUrl: string;
    cookie?: string;
  }) {
    super(masa);
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
    ): Promise<SessionUser | undefined> => {
      const cookieToUse = cookie || this.cookie;

      const checkSignatureResponse = await this._middlewareClient
        .post<SessionUser>(
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
        .catch((error: Error | AxiosError) => {
          console.error("Check signature failed!", error.message);
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
    getChallenge: async (): Promise<GetChallengeResult | undefined> => {
      const getChallengeResponse = await this._middlewareClient
        .get(`/session/get-challenge`)
        .catch((error: Error | AxiosError) => {
          console.error("Get Challenge failed!", error.message);
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

    logout: async (): Promise<LogoutResult | undefined> => {
      const logoutResponse = await this._middlewareClient
        .post<LogoutResult>(`/session/logout`, undefined, {
          headers: {
            cookie: this.cookie ? [this.cookie] : undefined,
          },
        })
        .catch((error: Error | AxiosError) => {
          console.error("Logout failed!,", error.message);
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
        .catch((error: Error | AxiosError) => {
          console.error("Failed to load Metadata!", error.message, uri);
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
      SoulNameMetadataStoreResult | SoulNameResultBase | undefined
    > => {
      console.log(`Writing metadata for '${soulName}'`);

      const storeMetadataResponse = await this._middlewareClient
        .post<SoulNameMetadataStoreResult | SoulNameResultBase>(
          "/storage/store",
          {
            soulName,
            receiver,
            duration,
            network: this.masa.config.networkName,
          },
          {
            headers: {
              cookie: this.cookie ? [this.cookie] : undefined,
            },
          }
        )
        .catch((error: Error | AxiosError) => {
          console.error("Storing metadata failed!", error.message);
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
    ): Promise<GenerateGreenResult | undefined> => {
      const result = {
        success: false,
        status: "failed",
        message: "Generating green failed",
      };

      const greenGenerateResponse = await this._middlewareClient
        .post<GenerateGreenResult>(
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
        .catch((error: Error | AxiosError) => {
          console.error("Generating green failed!", error.message);
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
        result.message = `Generating green failed! ${result.message}`;
        console.error(result.message);
      }

      return result;
    },

    verify: async (
      phoneNumber: string,
      code: string
    ): Promise<VerifyGreenResult | undefined> => {
      const result = {
        success: false,
        status: "failed",
        message: "Verifying green failed",
      };

      const greenVerifyResponse = await this._middlewareClient
        .post<VerifyGreenResult>(
          `/green/verify`,
          {
            phoneNumber,
            code,
            network: this.masa.config.networkName,
          },
          {
            headers: {
              cookie: this.cookie ? [this.cookie] : undefined,
            },
          }
        )
        .catch((error: Error | AxiosError) => {
          console.error("Verifying green failed!", error.message);
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
        result.message = `Verifying green failed! ${result.message}`;
        console.error(result.message);
      }

      return result;
    },
  };

  creditScore = {
    /**
     * Generates a new credit score
     */
    generate: async (): Promise<GenerateCreditScoreResult | undefined> => {
      const result = {
        success: false,
        status: "failed",
        message: "Credit Score failed",
      };

      const generateCreditScoreResponse = await this._middlewareClient
        .get<GenerateCreditScoreResult>(`/credit-score/generate`, {
          headers: {
            cookie: this.cookie ? [this.cookie] : undefined,
          },
        })
        .catch((error: Error | AxiosError) => {
          console.error("Generation of credit score failed!", error.message);
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
    ): Promise<UpdateCreditScoreResult | undefined> => {
      const result = {
        success: false,
        status: "failed",
        message: "Credit Score failed",
      };

      const updateCreditScoreResponse = await this._middlewareClient
        .post<UpdateCreditScoreResult>(
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
        .catch((error: Error | AxiosError) => {
          console.error("Updating credit score failed!", error.message);
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
        console.error("Updating of credit score failed!");
      }

      return result;
    },
  };
}
