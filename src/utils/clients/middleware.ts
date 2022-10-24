import axios from "axios";

const headers = {
  "Content-Type": "application/json",
};

export default class MasaClient {
  private middlewareClient;

  constructor({ apiUrl }: { apiUrl: string }) {
    this.middlewareClient = axios.create({
      baseURL: apiUrl,
      withCredentials: true,
      headers,
    });
  }

  sessionCheck = async (cookie?: string): Promise<any | undefined> => {
    const checkResponse = await this.middlewareClient
      .get(`/session/check`, {
        headers: {
          cookie: cookie ? [cookie] : undefined,
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

  getMetadata = async (uri: string, cookie?: string) => {
    const metadataResponse = await this.middlewareClient.get(uri, {
      headers: {
        cookie: cookie ? [cookie] : undefined,
      },
    });

    if (metadataResponse) {
      const { data: metadata } = metadataResponse;
      return metadata;
    }
  };

  metadataStore = async (
    soulName: string,
    cookie?: string
  ): Promise<any | undefined> => {
    const storeMetadataResponse = await this.middlewareClient
      .post(
        `/storage/store`,
        {
          soulName: `${soulName}.soul`,
        },
        {
          headers: {
            cookie: cookie ? [cookie] : undefined,
          },
        }
      )
      .catch((err: any) => {
        console.error(err.message);
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
        console.error(err.message);
      });

    if (getChallengeResponse) {
      const cookies = getChallengeResponse.headers["set-cookie"];

      let cookie;
      if (cookies) cookie = cookies[0];

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
    const checkSignatureResponse = await this.middlewareClient
      .post(
        `/session/check-signature`,
        {
          address,
          signature,
        },
        {
          headers: {
            cookie: cookie ? [cookie] : undefined,
          },
        }
      )
      .catch((err: any) => {
        console.error(err.message);
      });

    if (checkSignatureResponse) {
      const { data: checkSignatureData } = checkSignatureResponse;

      return checkSignatureData;
    }
  };

  creditScoreMint = async (
    address: string,
    signature: string,
    cookie?: string
  ) => {
    const storeMetadataResponse = await this.middlewareClient
      .post(
        `/contracts/credit-score/mint`,
        {
          address,
          signature,
        },
        {
          headers: {
            cookie: cookie ? [cookie] : undefined,
          },
        }
      )
      .catch((err: any) => {
        console.error(err.message);
      });

    if (storeMetadataResponse) {
      const {
        data: { success, message },
      } = storeMetadataResponse;

      return {
        success,
        message,
      };
    }
  };

  sessionLogout = async (cookie?: string) => {
    const logoutResponse = await this.middlewareClient
      .post(`/session/logout`, undefined, {
        headers: {
          cookie: cookie ? [cookie] : undefined,
        },
      })
      .catch((err: any) => {
        console.error(err.message);
      });

    if (logoutResponse) {
      const { data: logoutData } = logoutResponse;
      return logoutData;
    }
  };
}
