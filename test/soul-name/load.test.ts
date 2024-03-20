import { expect } from "chai";
import { before, describe } from "mocha";

import type { Masa } from "../../src";
import { getTestMasa } from "../tools/masa";

let masa: Masa;

describe("Soul Name", () => {
  before(() => {
    masa = getTestMasa("alfajores");
  });

  describe("load", () => {
    it("should load a soul name properly", async () => {
      const soulnameDetails = await masa.soulName.loadSoulNameByTokenId("12");
      expect(soulnameDetails?.metadata.name).to.equal("h34d.celo");
    }).timeout(10000);
  });
});
