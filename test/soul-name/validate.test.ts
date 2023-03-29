import { describe } from "mocha";
import { assert } from "chai";
import { calculateSoulNameLength, validateSoulName } from "../../src";
import { testMasa } from "../tools/masa";

describe("Soul Name", () => {
  describe("validate", () => {
    describe("validateSoulName", () => {
      describe("should be invalid", () => {
        const valid = false;

        it("π1.soul should be invalid!", () => {
          const { isValid, message, length } = validateSoulName(testMasa, "π1");
          assert(isValid === valid, message);
          assert(length === 2, length.toString());
        });

        it(",.soul should be invalid!", () => {
          const { isValid, message, length } = validateSoulName(testMasa, ",");
          assert(isValid === valid, message);
          assert(length === 1, length.toString());
        });

        it("|.soul should be invalid!", () => {
          const { isValid, message, length } = validateSoulName(testMasa, "|");
          assert(isValid === valid, message);
          assert(length === 1, length.toString());
        });

        it("\u{200d}.soul should be invalid!", () => {
          const { isValid, message, length } = validateSoulName(
            testMasa,
            "\u{200d}"
          );
          assert(isValid === valid, message);
          assert(length === 1, length.toString());
        });

        it("#.soul should be invalid!", () => {
          const { isValid, message, length } = validateSoulName(testMasa, "#");
          assert(isValid === valid, message);
          assert(length === 1, length.toString());
        });

        it("π.soul should be invalid!", () => {
          const { isValid, message, length } = validateSoulName(testMasa, "π");
          assert(isValid === valid, message);
          assert(length === 1, length.toString());
        });

        it("'.soul' should be invalid!", () => {
          const { isValid, message, length } = validateSoulName(testMasa, "");
          assert(isValid === valid, message);
          assert(length === 0);
        });

        it("' .soul' should be invalid!", () => {
          const { isValid, message, length } = validateSoulName(testMasa, " ");
          assert(isValid === valid, message);
          assert(length === 1, length.toString());
        });

        it("_.soul should be invalid!", () => {
          const { isValid, message, length } = validateSoulName(testMasa, "_");
          assert(isValid === valid, message);
          assert(length === 1, length.toString());
        });

        it("12 34.soul should be invalid!", () => {
          const { isValid, message, length } = validateSoulName(
            testMasa,
            "12 34"
          );
          assert(isValid === valid, message);
          assert(length === 5, length.toString());
        });

        it("ö🎉.soul should be invalid!", () => {
          const { isValid, message, length } = validateSoulName(
            testMasa,
            "ö🎉"
          );
          assert(isValid === valid, message);
          assert(length === 2, length.toString());
        });

        it("뎌쉐.soul should be invalid", () => {
          const { isValid, message, length } = validateSoulName(
            testMasa,
            "뎌쉐"
          );
          assert(isValid === valid, message);
          assert(length === 2, length.toString());
        });

        it("Z͑ͫ̓ͪ̂ͫ̽͏̴̙̤̞͉͚̯̞̠͍A̴̵̜̰͔ͫ͗͢L̠ͨͧͩ͘G̴̻͈͍͔̹̑͗̎̅͛́Ǫ̵̹̻̝̳͂̌̌͘.soul should be invalid!", () => {
          const { isValid, message, length } = validateSoulName(
            testMasa,
            "Z͑ͫ̓ͪ̂ͫ̽͏̴̙̤̞͉͚̯̞̠͍A̴̵̜̰͔ͫ͗͢L̠ͨͧͩ͘G̴̻͈͍͔̹̑͗̎̅͛́Ǫ̵̹̻̝̳͂̌̌͘"
          );
          assert(isValid === valid, message);
          assert(length === 5, length.toString());
        });

        it("Z͑ͫ̓ͪ̂ͫ̽͏̴̙̤̞͉͚̯̞̠͍A̴̵̜̰͔ͫ͗͢L̠ͨͧͩ͘G̴̻͈͍͔̹̑͗̎̅͛́Ǫ̵̹̻̝̳͂̌̌͘1.soul should be invalid!", () => {
          const { isValid, message, length } = validateSoulName(
            testMasa,
            "Z͑ͫ̓ͪ̂ͫ̽͏̴̙̤̞͉͚̯̞̠͍A̴̵̜̰͔ͫ͗͢L̠ͨͧͩ͘G̴̻͈͍͔̹̑͗̎̅͛́Ǫ̵̹̻̝̳͂̌̌͘1"
          );
          assert(isValid === valid, message);
          assert(length === 6, length.toString());
        });

        it("𝟙𝟛𝟛𝟟💀.soul should be invalid!", () => {
          const { isValid, message, length } = validateSoulName(
            testMasa,
            "𝟙𝟛𝟛𝟟💀"
          );
          assert(isValid === valid, message);
          assert(length === 5, length.toString());
        });

        it("𝟙𝟛𝟛𝟟.soul should be invalid!", () => {
          const { isValid, message, length } = validateSoulName(
            testMasa,
            "𝟙𝟛𝟛𝟟"
          );
          assert(isValid === valid, message);
          assert(length === 4, length.toString());
        });

        it(" 🌽.soul should be invalid", () => {
          const { isValid, message, length } = validateSoulName(
            testMasa,
            " 🌽"
          );
          assert(isValid === valid, message);
          assert(length === 2, length.toString());
        });

        it(" 🌽.soul should be invalid", () => {
          const { isValid, message, length } = validateSoulName(
            testMasa,
            " 🌽"
          );
          assert(isValid === valid, message);
          assert(length === 2, length.toString());
        });

        it(" 🌽.soul should be invalid", () => {
          const { isValid, message, length } = validateSoulName(
            testMasa,
            " 🌽"
          );
          assert(isValid === valid, message);
          assert(length === 2, length.toString());
        });

        it("#\u{FE0F}\u{20E3}.soul should be invalid", () => {
          const { isValid, message, length } = validateSoulName(
            testMasa,
            "#\u{FE0F}\u{20E3}"
          );
          assert(isValid === valid, message);
          assert(length === 1, length.toString());
        });
      });

      describe("should be valid", () => {
        const valid = true;

        it("1234.soul should be valid!", () => {
          const { isValid, message, length } = validateSoulName(
            testMasa,
            "1234"
          );
          assert(isValid === valid, message);
          assert(length === 4, length.toString());
        });

        it("12-34.soul should be valid", () => {
          const { isValid, message, length } = validateSoulName(
            testMasa,
            "12-34"
          );
          assert(isValid === valid, message);
          assert(length === 5, length.toString());
        });

        it("-.soul should be valid", () => {
          const { isValid, message, length } = validateSoulName(testMasa, "-");
          assert(isValid === valid, message);
          assert(length === 1, length.toString());
        });

        it("🐦-🐦.soul should be valid", () => {
          const { isValid, message, length } = validateSoulName(
            testMasa,
            "🐦-🐦"
          );
          assert(isValid === valid, message);
          assert(length === 3, length.toString());
        });

        it("☕️☕️.soul should be valid", () => {
          const { isValid, message, length } = validateSoulName(
            testMasa,
            "☕️☕️"
          );
          assert(isValid === valid, message);
          assert(length === 2, length.toString());
        });

        it("🎢rollercoaster🎢🎢.soul should be valid", () => {
          const { isValid, message, length } = validateSoulName(
            testMasa,
            "🎢rollercoaster🎢🎢"
          );
          assert(isValid === valid, message);
          assert(length === 16, length.toString());
        });

        it("..soul should be valid", () => {
          const { isValid, message, length } = validateSoulName(testMasa, ".");
          assert(isValid === valid, message);
          assert(length === 1, length.toString());
        });

        it("12.34.soul should be valid", () => {
          const { isValid, message, length } = validateSoulName(
            testMasa,
            "12.34"
          );
          assert(isValid === valid, message);
          assert(length === 5, length.toString());
        });

        it("🎉.soul should be valid", () => {
          const { isValid, message, length } = validateSoulName(testMasa, "🎉");
          assert(isValid === valid, message);
          assert(length === 1, length.toString());
        });

        it("te🎉st.soul should be valid", () => {
          const { isValid, message, length } = validateSoulName(
            testMasa,
            "te🎉st"
          );
          assert(isValid === valid, message);
          assert(length === 5, length.toString());
        });

        it("🎉🎉.soul should be valid", () => {
          const { isValid, message, length } = validateSoulName(
            testMasa,
            "🎉🎉"
          );
          assert(isValid === valid, message);
          assert(length === 2, length.toString());
        });

        it("❤️❤️.soul should be valid", () => {
          const { isValid, message, length } = validateSoulName(
            testMasa,
            "❤️❤️"
          );
          assert(isValid === valid, message);
          assert(length === 2, length.toString());
        });

        it("\u{2764}\u{2764}.soul should be valid", () => {
          const { isValid, message, length } = validateSoulName(
            testMasa,
            "\u{2764}\u{2764}"
          );
          assert(isValid === valid, message);
          assert(length === 2, length.toString());
        });

        it("\u{2764}\u{fe00}.soul should be valid", () => {
          const { isValid, message, length } = validateSoulName(
            testMasa,
            "\u{2764}\u{fe00}"
          );
          assert(isValid === valid, message);
          assert(length === 1, length.toString());
        });

        it("\u{2764}\u{fe05}.soul should be valid", () => {
          const { isValid, message, length } = validateSoulName(
            testMasa,
            "\u{2764}\u{fe05}"
          );
          assert(isValid === valid, message);
          assert(length === 1, length.toString());
        });

        it("\u{2764}\u{fe0f}.soul should be valid", () => {
          const { isValid, message, length } = validateSoulName(
            testMasa,
            "\u{2764}\u{fe0f}"
          );
          assert(isValid === valid, message);
          assert(length === 1, length.toString());
        });

        it("\u{2764}\u{fe0f}1.soul should be valid", () => {
          const { isValid, message, length } = validateSoulName(
            testMasa,
            "\u{2764}\u{fe0f}1"
          );
          assert(isValid === valid, message);
          assert(length === 2, length.toString());
        });

        it("❤.soul should be valid", () => {
          const { isValid, message, length } = validateSoulName(testMasa, "❤");
          assert(isValid === valid, message);
          assert(length === 1, length.toString());
        });

        it("💀.soul should be valid", () => {
          const { isValid, message, length } = validateSoulName(testMasa, "💀");
          assert(isValid === valid, message);
          assert(length === 1, length.toString());
        });

        it("1️.soul should be valid", () => {
          const { isValid, message, length } = validateSoulName(testMasa, "1️");
          assert(isValid === valid, message);
          assert(length === 1, length.toString());
        });

        it("2\u{FE0F}\u{20E3}.soul should be valid", () => {
          const { isValid, message, length } = validateSoulName(
            testMasa,
            "2\u{FE0F}\u{20E3}"
          );
          assert(isValid === valid, message);
          assert(length === 1, length.toString());
        });

        it("9\u{FE0F}\u{20E3}.soul should be valid", () => {
          const { isValid, message, length } = validateSoulName(
            testMasa,
            "9\u{FE0F}\u{20E3}"
          );
          assert(isValid === valid, message);
          assert(length === 1, length.toString());
        });

        it("\u{20E3}.soul should be valid", () => {
          const { isValid, message, length } = validateSoulName(
            testMasa,
            "\u{20E3}"
          );
          assert(isValid === valid, message);
          assert(length === 1, length.toString());
        });

        it("1💀.soul should be valid", () => {
          const { isValid, message, length } = validateSoulName(
            testMasa,
            "1💀"
          );
          assert(isValid === valid, message);
          assert(length === 2, length.toString());
        });

        it("💀💀💀💀💀.soul should be valid", () => {
          const { isValid, message, length } = validateSoulName(
            testMasa,
            "💀💀💀💀💀"
          );

          assert(isValid === valid, message);
          assert(length === 5, length.toString());
        });

        it("💀💀💀11one💀💀.soul should be valid", () => {
          const { isValid, message, length } = validateSoulName(
            testMasa,
            "💀💀💀11one💀💀"
          );
          assert(isValid === valid, message);
          assert(length === 10);
        });

        it("™™.soul should be valid!", () => {
          const { isValid, message, length } = validateSoulName(testMasa, "™™");
          assert(isValid === valid, message);
          assert(length === 2, length.toString());
        });
      });
    });

    describe("calculateSoulNameLength", () => {
      it("should count normal strings", () => {
        const count = calculateSoulNameLength("1234");
        assert(count === 4);
      });

      it("should calculate Z͑ͫ̓ͪ̂ͫ̽͏̴̙̤̞͉͚̯̞̠͍A̴̵̜̰͔ͫ͗͢L̠ͨͧͩ͘G̴̻͈͍͔̹̑͗̎̅͛́Ǫ̵̹̻̝̳͂̌̌͘  correctly!", () => {
        const length = calculateSoulNameLength("Z͑ͫ̓ͪ̂ͫ̽͏̴̙̤̞͉͚̯̞̠͍A̴̵̜̰͔ͫ͗͢L̠ͨͧͩ͘G̴̻͈͍͔̹̑͗̎̅͛́Ǫ̵̹̻̝̳͂̌̌͘");
        assert(length === 5, length.toString());
      });

      it("should count 🎉🎉 emojis properly", () => {
        const length = calculateSoulNameLength("🎉🎉");
        assert(length === 2, length.toString());
      });

      it("should count  🌽 emojis and control chars properly", () => {
        const length = calculateSoulNameLength(" 🌽");
        assert(length === 2, length.toString());
      });
    });
  });
});
