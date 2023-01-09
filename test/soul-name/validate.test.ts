import { describe } from "mocha";
import { validateSoulName } from "../../src";
import { testMasa } from "../tools/masa";
import { assert } from "chai";

describe("Soul Name", () => {
  describe("validate", () => {
    describe("validateSoulName", () => {
      it("should validate π1.soul", () => {
        const { isValid, message, length } = validateSoulName(testMasa, "π1");
        assert(isValid === false, message);
        assert(length === 2);
      });

      it("should validate π.soul", () => {
        const { isValid, message, length } = validateSoulName(testMasa, "π");
        assert(isValid === false, message);
        assert(length === 1);
      });

      it("should validate .soul", () => {
        const { isValid, message, length } = validateSoulName(testMasa, "");
        assert(isValid === false, message);
        assert(length === 0);
      });

      it("should validate ' .soul'", () => {
        const { isValid, message, length } = validateSoulName(testMasa, " ");
        assert(isValid === false, message);
        assert(length === 1);
      });

      it("should validate ™.soul", () => {
        const { isValid, message, length } = validateSoulName(testMasa, "™");
        assert(isValid === false, message);
        assert(length === 1);
      });

      it("should validate ™™.soul", () => {
        const { isValid, message, length } = validateSoulName(testMasa, "™™");
        assert(isValid === false, message);
        assert(length === 2);
      });

      it("should validate 12 34.soul", () => {
        const { isValid, message, length } = validateSoulName(
          testMasa,
          "12 34"
        );
        assert(isValid === false, message);
        assert(length === 5);
      });

      it("should validate 1234.soul", () => {
        const { isValid, message, length } = validateSoulName(testMasa, "1234");
        assert(isValid === true, message);
        assert(length === 4);
      });

      it("should validate 12-34.soul", () => {
        const { isValid, message, length } = validateSoulName(
          testMasa,
          "12-34"
        );
        assert(isValid, message);
        assert(length === 5);
      });

      it("should validate -.soul", () => {
        const { isValid, message, length } = validateSoulName(testMasa, "-");
        assert(isValid, message);
        assert(length === 1);
      });

      it("should validate ..soul", () => {
        const { isValid, message, length } = validateSoulName(testMasa, ".");
        assert(isValid, message);
        assert(length === 1);
      });

      it("should validate 12.34.soul", () => {
        const { isValid, message, length } = validateSoulName(
          testMasa,
          "12.34"
        );
        assert(isValid, message);
        assert(length === 5);
      });

      it("should validate ❤️❤️.soul", () => {
        const { isValid, message, length } = validateSoulName(testMasa, "❤️❤️");
        assert(isValid, message);
        assert(length === 2);
      });

      it("should validate ❤️.soul", () => {
        const { isValid, message, length } = validateSoulName(testMasa, "❤️");
        assert(isValid, message);
        assert(length === 1);
      });

      it("should validate ❤️1.soul", () => {
        const { isValid, message, length } = validateSoulName(testMasa, "❤️1");
        assert(isValid, message);
        assert(length === 2);
      });

      it("should validate ❤.soul", () => {
        const { isValid, message, length } = validateSoulName(testMasa, "❤");
        assert(isValid, message);
        assert(length === 1);
      });

      it("should validate 💀.soul", () => {
        const { isValid, message, length } = validateSoulName(testMasa, "💀");
        assert(isValid, message);
        assert(length === 1);
      });

      it("should validate Z͑ͫ̓ͪ̂ͫ̽͏̴̙̤̞͉͚̯̞̠͍A̴̵̜̰͔ͫ͗͢L̠ͨͧͩ͘G̴̻͈͍͔̹̑͗̎̅͛́Ǫ̵̹̻̝̳͂̌̌͘.soul", () => {
        const { isValid, message, length } = validateSoulName(
          testMasa,
          "Z͑ͫ̓ͪ̂ͫ̽͏̴̙̤̞͉͚̯̞̠͍A̴̵̜̰͔ͫ͗͢L̠ͨͧͩ͘G̴̻͈͍͔̹̑͗̎̅͛́Ǫ̵̹̻̝̳͂̌̌͘"
        );
        assert(!isValid, message);
        assert(length === 5);
      });
      it("should validate Z͑ͫ̓ͪ̂ͫ̽͏̴̙̤̞͉͚̯̞̠͍A̴̵̜̰͔ͫ͗͢L̠ͨͧͩ͘G̴̻͈͍͔̹̑͗̎̅͛́Ǫ̵̹̻̝̳͂̌̌͘1.soul", () => {
        const { isValid, message, length } = validateSoulName(
          testMasa,
          "Z͑ͫ̓ͪ̂ͫ̽͏̴̙̤̞͉͚̯̞̠͍A̴̵̜̰͔ͫ͗͢L̠ͨͧͩ͘G̴̻͈͍͔̹̑͗̎̅͛́Ǫ̵̹̻̝̳͂̌̌͘1"
        );
        assert(!isValid, message);
        assert(length === 6);
      });
    });
  });
});
