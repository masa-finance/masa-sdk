import { assert } from "chai";
import { providers, Wallet } from "ethers";
import { before, describe } from "mocha";

import { Masa, SupportedNetworks } from "../../src";

let masa: Masa;

describe("Soul Name", () => {
  before(() => {
    const provider = new providers.JsonRpcProvider(
      SupportedNetworks.goerli.rpcUrls[0]
    );
    const wallet = new Wallet(
      "8da4ef21b864d2cc526dbdb2a120bd2874c36c9d0a1fb7f8c63d7f7a8b41de8f",
      provider
    );

    masa = new Masa({
      signer: wallet,
      networkName: "goerli",
    });
  });

  describe("load", () => {
    it("should load a soul name properly", async () => {
      const soulnameDetails = await masa.soulName.loadSoulNameByTokenId("0");
      assert.equal(soulnameDetails.metadata.name, "h34d.soul");
    }).timeout(5000);
  });
});
