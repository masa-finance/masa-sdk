import { assert } from "chai";
import { before, describe } from "mocha";

import type { Masa } from "../../src";
import { getTestMasa } from "../tools/masa";

let masa: Masa;

describe("Soul Name", () => {
  before(() => {
    masa = getTestMasa("goerli");
  });

  describe("load", () => {
    it("should load a soul name properly", async () => {
      const soulnameDetails = await masa.soulName.loadSoulNameByTokenId("0");
      assert.equal(soulnameDetails.metadata.name, "h34d.soul");
    }).timeout(5000);
  });
});
