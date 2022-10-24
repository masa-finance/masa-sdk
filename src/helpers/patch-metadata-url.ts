import Masa from "../masa";

export const patchMetadataUrl = (masa: Masa, tokeUri: string) => {
  const apiUrl: string = masa.config.apiUrl;
  const env: string = masa.config.environment;

  if (tokeUri.indexOf("beta") > -1) {
    if (apiUrl.indexOf("localhost") > -1 || apiUrl.indexOf("127.0.0.1") > -1) {
      return tokeUri.replace("https://beta.metadata.masa.finance/", apiUrl);
    } else {
      return tokeUri.replace("beta", env);
    }
  }
  return tokeUri;
};
