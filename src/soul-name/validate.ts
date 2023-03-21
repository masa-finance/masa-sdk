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

  // alphanumeric handling
  const alphaNumeric: RegExp = /a-zA-Z0-9/;
  // allow some punctuation
  // eslint-disable-next-line no-useless-escape
  const punctuation: RegExp = /.\-/;
  // pictographic handling
  // https://en.wikipedia.org/wiki/Symbols_and_Pictographs_Extended-A
  const pictographic: RegExp = /\p{Extended_Pictographic}/u;
  // \u{FE00}-\u{FE0F} is the emoji variant selector
  // http://unicode.org/charts//PDF/Unicode-3.2/U32-FE00.pdf
  const emojiVariants: RegExp = /\u{FE00}-\u{FE0F}/u;
  // emoji keycaps handling
  // http://www.unicode.org/L2/L2017/17086-vs16-keycaps-emoji.pdf
  const emojiKeyCaps: RegExp = /\u{20E3}/u;

  // combine validator
  const validator = new RegExp(
    `^[${[
      alphaNumeric,
      punctuation,
      pictographic,
      emojiVariants,
      emojiKeyCaps,
    ].map((regEx: RegExp) => regEx.source)}]+$`,
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
