import { SoulNameMetadataStoreResult, SoulNameResultBase } from "../interface";

export const isSoulNameMetadataStoreResult = (
  result: SoulNameResultBase
): result is SoulNameMetadataStoreResult => {
  return !!(result as SoulNameMetadataStoreResult).authorityAddress;
};
