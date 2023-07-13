import type { MasaInterface } from "../../interface";
import { calculateSoulNameLength } from "./helpers";

export const validateSoulName = (
  masa: MasaInterface,
  soulName: string,
  verbose?: boolean,
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

  const validatorSource = `^[${[
    alphaNumeric,
    punctuation,
    pictographic,
    emojiVariants,
    emojiKeyCaps,
  ]
    .map((regExp: RegExp) => regExp.source)
    .join("")}]+$`;

  if (verbose) {
    console.info(validatorSource);
  }

  // combine validator
  const validator = new RegExp(validatorSource, "u");
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
