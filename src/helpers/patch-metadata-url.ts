import { MasaInterface } from "../interface/masa-interface";

/**
 * todo: fix this thing, its not good
 * @param masa
 * @param metadataUrl
 */
export const patchMetadataUrl = (masa: MasaInterface, metadataUrl: string) => {
  const env: string = masa.config.environment;
  // make sure this ends with / otherwise it blows
  const apiUrl: string = !masa.config.apiUrl.endsWith("/")
    ? `${masa.config.apiUrl}/`
    : masa.config.apiUrl;

  if (metadataUrl.indexOf("beta") > -1) {
    if (apiUrl.indexOf("localhost") > -1 || apiUrl.indexOf("127.0.0.1") > -1) {
      return metadataUrl.replace("https://beta.metadata.masa.finance/", apiUrl);
    } else {
      return metadataUrl.replace("beta", env);
    }
  }
  return metadataUrl;
};
