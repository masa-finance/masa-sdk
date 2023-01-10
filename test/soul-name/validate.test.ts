import { describe } from "mocha";
import { validateSoulName } from "../../src";
import { testMasa } from "../tools/masa";
import { assert } from "chai";

describe("Soul Name", () => {
  describe("validate", () => {
    describe("validateSoulName", () => {
      it("π1.soul should be invalid!", () => {
        const { isValid, message, length } = validateSoulName(testMasa, "π1");
        assert(isValid === false, message);
        assert(length === 2);
      });

      it("π.soul should be invalid!", () => {
        const { isValid, message, length } = validateSoulName(testMasa, "π");
        assert(isValid === false, message);
        assert(length === 1);
      });

      it("'.soul' should be invalid!", () => {
        const { isValid, message, length } = validateSoulName(testMasa, "");
        assert(isValid === false, message);
        assert(length === 0);
      });

      it("' .soul' should be invalid!", () => {
        const { isValid, message, length } = validateSoulName(testMasa, " ");
        assert(isValid === false, message);
        assert(length === 1);
      });

      it("_.soul should be invalid!", () => {
        const { isValid, message, length } = validateSoulName(testMasa, "_");
        assert(isValid === false, message);
        assert(length === 1);
      });

      it("™.soul should be invalid!", () => {
        const { isValid, message, length } = validateSoulName(testMasa, "™");
        assert(isValid === false, message);
        assert(length === 1);
      });

      it("™™.soul should be invalid!", () => {
        const { isValid, message, length } = validateSoulName(testMasa, "™™");
        assert(isValid === false, message);
        assert(length === 2);
      });

      it("12 34.soul should be invalid!", () => {
        const { isValid, message, length } = validateSoulName(
          testMasa,
          "12 34"
        );
        assert(isValid === false, message);
        assert(length === 5);
      });

      it("1234.soul should be valid!", () => {
        const { isValid, message, length } = validateSoulName(testMasa, "1234");
        assert(isValid === true, message);
        assert(length === 4);
      });

      it("12-34.soul should be valid", () => {
        const { isValid, message, length } = validateSoulName(
          testMasa,
          "12-34"
        );
        assert(isValid === true, message);
        assert(length === 5);
      });

      it("-.soul should be valid", () => {
        const { isValid, message, length } = validateSoulName(testMasa, "-");
        assert(isValid === true, message);
        assert(length === 1);
      });

      it("🐦-🐦.soul should be valid", () => {
        const { isValid, message, length } = validateSoulName(
          testMasa,
          "🐦-🐦"
        );
        assert(isValid === true, message);
        assert(length === 3);
      });

      it("☕️☕️.soul should be valid", () => {
        const { isValid, message, length } = validateSoulName(
          testMasa,
          "☕️☕️"
        );
        assert(isValid === true, message);
        assert(length === 2);
      });

      it("🎢rollercoaster🎢🎢.soul should be valid", () => {
        const { isValid, message, length } = validateSoulName(
          testMasa,
          "🎢rollercoaster🎢🎢"
        );
        assert(isValid === true, message);
        assert(length === 16, length.toString());
      });

      it("..soul should be valid", () => {
        const { isValid, message, length } = validateSoulName(testMasa, ".");
        assert(isValid === true, message);
        assert(length === 1);
      });

      it("12.34.soul should be valid", () => {
        const { isValid, message, length } = validateSoulName(
          testMasa,
          "12.34"
        );
        assert(isValid === true, message);
        assert(length === 5);
      });

      it("🎉.soul should be valid", () => {
        const { isValid, message, length } = validateSoulName(testMasa, "🎉");
        assert(isValid === true, message);
        assert(length === 1);
      });

      it("te🎉st.soul should be valid", () => {
        const { isValid, message, length } = validateSoulName(
          testMasa,
          "te🎉st"
        );
        assert(isValid === true, message);
        assert(length === 5);
      });

      it("🎉🎉.soul should be valid", () => {
        const { isValid, message, length } = validateSoulName(testMasa, "🎉🎉");
        assert(isValid === true, message);
        assert(length === 2);
      });

      it("❤️❤️.soul should be valid", () => {
        const { isValid, message, length } = validateSoulName(testMasa, "❤️❤️");
        assert(isValid === true, message);
        assert(length === 2);
      });

      it("\u2764\u2764.soul should be valid", () => {
        const { isValid, message, length } = validateSoulName(
          testMasa,
          "\u2764\u2764"
        );
        assert(isValid === true, message);
        assert(length === 2);
      });

      it("\u2764\ufe0f.soul should be valid", () => {
        const { isValid, message, length } = validateSoulName(
          testMasa,
          "\u2764\ufe0f"
        );
        assert(isValid === true, message);
        assert(length === 1);
      });

      it("\u{2764}\u{fe0f}1.soul should be valid", () => {
        const { isValid, message, length } = validateSoulName(
          testMasa,
          "\u{2764}\u{fe0f}1"
        );
        assert(isValid === true, message);
        assert(length === 2);
      });

      it("뎌쉐.soul should be invalid", () => {
        const { isValid, message, length } = validateSoulName(
          testMasa,
          "뎌쉐"
        );
        assert(isValid === false, message);
        assert(length === 2);
      });

      it("❤.soul should be valid", () => {
        const { isValid, message, length } = validateSoulName(testMasa, "❤");
        assert(isValid === true, message);
        assert(length === 1);
      });

      it("💀.soul should be valid", () => {
        const { isValid, message, length } = validateSoulName(testMasa, "💀");
        assert(isValid === true, message);
        assert(length === 1);
      });

      it("1💀.soul should be valid", () => {
        const { isValid, message, length } = validateSoulName(testMasa, "1💀");
        assert(isValid === true, message);
        assert(length === 2);
      });

      it("💀💀💀💀💀.soul should be valid", () => {
        const { isValid, message, length } = validateSoulName(
          testMasa,
          "💀💀💀💀💀"
        );
        assert(isValid === true, message);
        assert(length === 5);
      });

      it("💀💀💀11one💀💀.soul should be valid", () => {
        const { isValid, message, length } = validateSoulName(
          testMasa,
          "💀💀💀11one💀💀"
        );
        assert(isValid === true, message);
        assert(length === 10);
      });

      it("Z͑ͫ̓ͪ̂ͫ̽͏̴̙̤̞͉͚̯̞̠͍A̴̵̜̰͔ͫ͗͢L̠ͨͧͩ͘G̴̻͈͍͔̹̑͗̎̅͛́Ǫ̵̹̻̝̳͂̌̌͘.soul should be invalid!", () => {
        const { isValid, message, length } = validateSoulName(
          testMasa,
          "Z͑ͫ̓ͪ̂ͫ̽͏̴̙̤̞͉͚̯̞̠͍A̴̵̜̰͔ͫ͗͢L̠ͨͧͩ͘G̴̻͈͍͔̹̑͗̎̅͛́Ǫ̵̹̻̝̳͂̌̌͘"
        );
        assert(isValid === false, message);
        assert(length === 5);
      });

      it("Z͑ͫ̓ͪ̂ͫ̽͏̴̙̤̞͉͚̯̞̠͍A̴̵̜̰͔ͫ͗͢L̠ͨͧͩ͘G̴̻͈͍͔̹̑͗̎̅͛́Ǫ̵̹̻̝̳͂̌̌͘1.soul should be invalid!", () => {
        const { isValid, message, length } = validateSoulName(
          testMasa,
          "Z͑ͫ̓ͪ̂ͫ̽͏̴̙̤̞͉͚̯̞̠͍A̴̵̜̰͔ͫ͗͢L̠ͨͧͩ͘G̴̻͈͍͔̹̑͗̎̅͛́Ǫ̵̹̻̝̳͂̌̌͘1"
        );
        assert(isValid === false, message);
        assert(length === 6);
      });
    });
  });
});
