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

  // alpha handling
  // eslint-disable-next-line no-useless-escape
  const alpha: RegExp = /a-zA-Z0-9.\-/;
  // emoji handling
  const emoji: RegExp = /\p{Emoji_Presentation}/u;
  // \u{2764} is special handling for red heart
  const heart: RegExp = /\u{2764}/u;
  // \u{FE00}-\u{FE0F} is the emoji connector
  const emojiConnector: RegExp = /\u{FE00}-\u{FE0F}/u;

  // combine validator
  const validator = new RegExp(
    `^[${[alpha, emoji, heart, emojiConnector].map(
      (regEx: RegExp) => regEx.source
    )}]+$`,
    "u"
  );
  const isValid = validator.test(soulName);
  const hasWhitespace = soulName.includes(" ");

  if (result.length < 1) {
    result.message = "Soulname must be at least 1 character long";
    return result;
  }

  if (hasWhitespace) {
    result.message = "Soulname can not include spaces";
    return result;
  }

  if (!isValid) {
    result.message =
      "Soulname must contain only alphanumeric or emoji characters";
    return result;
  }

  result.isValid = true;

  return result;
};
