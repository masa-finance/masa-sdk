import type {
  SoulNameMetadataStoreResult,
  SoulNameResultBase,
} from "../interface";

export const isSoulNameMetadataStoreResult = (
  result: SoulNameResultBase
): result is SoulNameMetadataStoreResult => {
  return Boolean((result as SoulNameMetadataStoreResult).authorityAddress);
};
