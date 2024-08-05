import type { AxiosInstance, AxiosResponse } from "axios";
import axios, { AxiosError } from "axios";

import type {
  BaseResult,
  ChallengeResult,
  ChallengeResultWithCookie,
  ISession,
  LogoutResult,
  MasaInterface,
  NetworkName,
  SessionUser,
  SoulNameMetadataStoreResult,
  SoulNameResultBase,
} from "../../interface";
import { isSession } from "../../interface";
import { MasaBase } from "../../masa-base";

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
    masa: MasaInterface;
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
      const { data: session } = await this.get<ISession | BaseResult>(
        "/session/check",
        true,
      );

      return isSession(session) ? session : undefined;
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
      cookie?: string,
    ): Promise<SessionUser | undefined> => {
      let result;

      const cookieToUse = cookie || this.cookie;

      const checkSignatureResponse = await this._middlewareClient
        .post<
          {
            address: string;
            signature: string;
          },
          AxiosResponse<SessionUser | BaseResult>
        >(
          "/session/check-signature",
          {
            address,
            signature,
          },
          {
            headers: {
              cookie: cookieToUse ? [cookieToUse] : undefined,
            },
          },
        )
        .catch((error: Error | AxiosError) => {
          console.error("Check signature failed!", error.message);
        });

      const { data: checkSignatureResponseData, status } =
        checkSignatureResponse || {};

      if (this.masa.config.verbose) {
        console.info({
          checkSignatureResponse: {
            status,
            checkSignatureResponseData,
          },
        });
      }

      if (
        checkSignatureResponseData &&
        "userId" in checkSignatureResponseData
      ) {
        // set the cookie here, so we can reuse it during the lifespan of the
        // masa object if it is not set yet
        if (cookie && !this.cookie) {
          this._cookie = cookie;
        }

        result = checkSignatureResponseData;
      }

      return result;
    },

    /**
     * Get challenge
     */
    getChallenge: async (): Promise<ChallengeResultWithCookie | undefined> => {
      let result;

      const getChallengeResponse = await this._middlewareClient
        .get<ChallengeResult>("/session/get-challenge")
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

        const { data: getChallengeResponseData, status } =
          getChallengeResponse || {};

        if (this.masa.config.verbose) {
          console.info({
            getChallengeResponse: {
              status,
              getChallengeResponseData,
              cookie,
            },
          });
        }

        if (getChallengeResponseData) {
          result = {
            ...getChallengeResponseData,
            cookie,
          };
        }
      }

      return result;
    },

    /**
     * Logout the current user
     */
    logout: async (): Promise<LogoutResult | undefined> => {
      const { data: logoutResult } = await this.post<undefined, LogoutResult>(
        "/session/logout",
        undefined,
      );
      delete this._cookie;
      return logoutResult;
    },
  };

  soulName = {
    /**
     * Store metadata
     * @param soulName
     * @param receiver
     * @param duration
     * @param style
     */
    store: async (
      soulName: string,
      receiver: string,
      duration: number,
      style?: string,
    ): Promise<
      SoulNameMetadataStoreResult | SoulNameResultBase | undefined
    > => {
      console.log(`Writing metadata for '${soulName}'`);

      const { data: soulNameMetadataStoreResult } = await this.post<
        {
          soulName: string;
          receiver: string;
          duration: number;
          network: NetworkName;
          style?: string;
        },
        SoulNameMetadataStoreResult | SoulNameResultBase
      >("/soul-name/store", {
        soulName,
        receiver,
        duration,
        network: this.masa.config.networkName,
        style,
      });

      return soulNameMetadataStoreResult;
    },
  };

  post = async <Request, Result>(
    endpoint: string,
    data: Request,
    silent: boolean = false,
  ): Promise<{
    data: Result | undefined;
    status: number | undefined;
    statusText: string | undefined;
  }> => {
    if (this.masa.config.verbose) {
      console.log(`Posting '${JSON.stringify(data)}' to '${endpoint}'`);
    }

    const postResponse = await this._middlewareClient
      .post<Request, AxiosResponse<Result>>(endpoint, data, {
        withCredentials: true,
        headers: {
          cookie: this.cookie ? [this.cookie] : undefined,
        },
      })
      .catch((error: Error | AxiosError) => {
        if (!silent) {
          console.error(`Post '${endpoint}' failed!`, error.message);
        }

        if (error instanceof AxiosError) {
          return error.response as AxiosResponse<Result>;
        }
      });

    const { data: postResponseData, status, statusText } = postResponse || {};

    if (this.masa.config.verbose) {
      console.info({
        postResponse: {
          status,
          postResponseData,
        },
      });
    }

    return {
      data: postResponseData,
      status,
      statusText,
    };
  };

  patch = async <Request, Result>(
    endpoint: string,
    data: Request,
    silent: boolean = false,
  ): Promise<{
    data: Result | undefined;
    status: number | undefined;
    statusText: string | undefined;
  }> => {
    if (this.masa.config.verbose) {
      console.log(`Patching '${JSON.stringify(data)}' to '${endpoint}'`);
    }

    const patchResponse = await this._middlewareClient
      .patch<Request, AxiosResponse<Result>>(endpoint, data, {
        withCredentials: true,
        headers: {
          cookie: this.cookie ? [this.cookie] : undefined,
        },
      })
      .catch((error: Error | AxiosError) => {
        if (!silent) {
          console.error(`Patch '${endpoint}' failed!`, error.message);
        }

        if (error instanceof AxiosError) {
          return error.response as AxiosResponse<Result>;
        }
      });

    const { data: patchData, status, statusText } = patchResponse || {};

    if (this.masa.config.verbose) {
      console.info({
        patchResponse: {
          status,
          patchData,
        },
      });
    }

    return {
      data: patchData,
      status,
      statusText,
    };
  };

  get = async <Result>(
    endpoint: string,
    silent: boolean = false,
  ): Promise<{
    data: Result | undefined;
    status: number | undefined;
    statusText: string | undefined;
  }> => {
    if (this.masa.config.verbose) {
      console.log(`Getting '${endpoint}'`);
    }

    const getResponse = await this._middlewareClient
      .get<Result>(endpoint, {
        withCredentials: true,
        headers: {
          cookie: this.cookie ? [this.cookie] : undefined,
        },
      })
      .catch((error: Error | AxiosError) => {
        if (!silent) {
          console.error(`Get '${endpoint}' failed!`, error.message);
        }

        if (error instanceof AxiosError) {
          return error.response as AxiosResponse<Result>;
        }
      });

    const { data: getData, status, statusText } = getResponse || {};

    if (this.masa.config.verbose) {
      console.dir(
        {
          getResponse: {
            status,
            getData,
          },
        },
        {
          depth: null,
        },
      );
    }

    return {
      data: getData,
      status,
      statusText,
    };
  };
}
