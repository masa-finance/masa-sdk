import Masa from "../masa";
import GraphemeSplitter from "grapheme-splitter";

export const calculateSoulNameLength = (soulName: string) => {
  return new GraphemeSplitter().countGraphemes(soulName);
};

export const getSoulNameMetadataPrefix = (masa: Masa): string => {
  // special handling for celo networks
  return masa.config.network === "celo" || masa.config.network === "alfajores"
    ? "https://arweave.net/"
    : "ar://";
};

export const validateSoulName = (
  masa: Masa,
  soulName: string
): { isValid: boolean; length: number; message?: string } => {
  const result: { isValid: boolean; length: number; message?: string } = {
    isValid: false,
    length: calculateSoulNameLength(soulName),
  };

  // \u{2764} is special handling for red heart
  const isEmoji = /[\p{Emoji_Presentation}\u{2764}]/gmu.test(soulName);
  const isAlpha = /^[a-zA-Z0-9.-]+$/gmu.test(soulName);
  const hasWhitespace = soulName.includes(" ");

  if (result.length < 1) {
    result.message = "Soulname must be at least 1 character long";
    return result;
  }

  if (hasWhitespace) {
    result.message = "Soulname can not include spaces";
    return result;
  }

  if (!isAlpha && !isEmoji) {
    result.message =
      "Soulname must contain only alphanumeric or emoji characters";
    return result;
  }

  result.isValid = true;

  return result;
};
