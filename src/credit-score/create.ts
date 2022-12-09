import Masa from "../masa";
import { signMessage, Templates } from "../utils";
import { CreateCreditScoreResult } from "../interface";
// Promise<CreateCreditScoreResult>
export const createCreditScore = async (masa: Masa) => {
  const result: CreateCreditScoreResult = {
    success: false,
    message: "Unknown Error",
  };

  if (await masa.session.checkLogin()) {
    const address = await masa.config.wallet.getAddress();

    const identityId = await masa.identity.load(address);
    if (!identityId) {
      result.message = "No Identity";
      return result;
    }

    // const creditScoreResponse = await masa.client.createCreditScore(address);

    // console.log({ creditScoreResponse });
    //@ts-ignore
    // if (creditScoreResponse?.signature) {
    //  const wallet = masa.config.wallet;
    //@ts-ignore
    //  const date = new Date(creditScoreResponse.creditScore.lastUpdated).getTime();
    //@ts-ignore
    // const tx = await masa.contracts.mintCreditScore(wallet, "eth", date, creditScoreResponse.creditScore.account , creditScoreResponse.signature)
    // console.log("CREDIT SCORE",{tx})

    // console.log("Waiting for transaction to finalize")
    // const recipe = await tx.wait()

    const recipe = {
      to: "0xc51cC18238426108f9eC51203d6a590ce8516B68",
      from: "0xe7D2AB3F051c385A025C177348f17463231BEB5e",
      contractAddress: null,
      transactionIndex: 9,
      gasUsed: {
        type: "BigNumber",
        hex: "0x02bbe7",
      },
      logsBloom:
        "0x04000000000000000000000000000000000001200000000000010000000000000000000000000000000000000000000000000000040000000000000000000000000000000020000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000400040000000000000000000000000000000000000000000000000000000000000000000000000000000000080000000000000800100000000000000000400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000400000000000000000000000008000000000000000000000",
      blockHash:
        "0x273fa489b733fbc590605078e578862bd22b6df475e1624912b91010a0d9bdea",
      transactionHash:
        "0x6ba64f962b103b867c7a5cec2224aae31ebe5e472f77cda56fe5db05554930c6",
      logs: [
        {
          transactionIndex: 9,
          blockNumber: 8101010,
          transactionHash:
            "0x6ba64f962b103b867c7a5cec2224aae31ebe5e472f77cda56fe5db05554930c6",
          address: "0xc51cC18238426108f9eC51203d6a590ce8516B68",
          topics: [
            "0x0f6798a560793a54c3bcfe86a93cde1e73087d944c0ea20544137d4121396885",
            "0x000000000000000000000000e7d2ab3f051c385a025c177348f17463231beb5e",
            "0x0000000000000000000000000000000000000000000000000000000000000002",
          ],
          data: "0x",
          logIndex: 17,
          blockHash:
            "0x273fa489b733fbc590605078e578862bd22b6df475e1624912b91010a0d9bdea",
        },
        {
          transactionIndex: 9,
          blockNumber: 8101010,
          transactionHash:
            "0x6ba64f962b103b867c7a5cec2224aae31ebe5e472f77cda56fe5db05554930c6",
          address: "0xc51cC18238426108f9eC51203d6a590ce8516B68",
          topics: [
            "0xba587fc996588eaf73691ecc5a1c4c42228fab71b44f01544686211cb1e68177",
          ],
          data: "0x000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000040000000000000000000000003c8d9f130970358b7e8cbc1dbd0a1eba6ebe368f00000000000000000000000000000000000000000000000000000184f44c589800000000000000000000000057f1887a8bf19b14fc0df6fd9b2acc9af147ea850000000000000000000000000000000000000000000000000000000000000000",
          logIndex: 18,
          blockHash:
            "0x273fa489b733fbc590605078e578862bd22b6df475e1624912b91010a0d9bdea",
        },
      ],
      blockNumber: 8101010,
      confirmations: 1,
      cumulativeGasUsed: {
        type: "BigNumber",
        hex: "0x15c527",
      },
      effectiveGasPrice: {
        type: "BigNumber",
        hex: "0x59682f0a",
      },
      status: 1,
      type: 2,
      byzantium: true,
      events: [
        {
          transactionIndex: 9,
          blockNumber: 8101010,
          transactionHash:
            "0x6ba64f962b103b867c7a5cec2224aae31ebe5e472f77cda56fe5db05554930c6",
          address: "0xc51cC18238426108f9eC51203d6a590ce8516B68",
          topics: [
            "0x0f6798a560793a54c3bcfe86a93cde1e73087d944c0ea20544137d4121396885",
            "0x000000000000000000000000e7d2ab3f051c385a025c177348f17463231beb5e",
            "0x0000000000000000000000000000000000000000000000000000000000000002",
          ],
          data: "0x",
          logIndex: 17,
          blockHash:
            "0x273fa489b733fbc590605078e578862bd22b6df475e1624912b91010a0d9bdea",
          args: [
            "0xe7D2AB3F051c385A025C177348f17463231BEB5e",
            {
              type: "BigNumber",
              hex: "0x02",
            },
          ],
          event: "Mint",
          eventSignature: "Mint(address,uint256)",
        },
        {
          transactionIndex: 9,
          blockNumber: 8101010,
          transactionHash:
            "0x6ba64f962b103b867c7a5cec2224aae31ebe5e472f77cda56fe5db05554930c6",
          address: "0xc51cC18238426108f9eC51203d6a590ce8516B68",
          topics: [
            "0xba587fc996588eaf73691ecc5a1c4c42228fab71b44f01544686211cb1e68177",
          ],
          data: "0x000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000040000000000000000000000003c8d9f130970358b7e8cbc1dbd0a1eba6ebe368f00000000000000000000000000000000000000000000000000000184f44c589800000000000000000000000057f1887a8bf19b14fc0df6fd9b2acc9af147ea850000000000000000000000000000000000000000000000000000000000000000",
          logIndex: 18,
          blockHash:
            "0x273fa489b733fbc590605078e578862bd22b6df475e1624912b91010a0d9bdea",
          args: [
            {
              type: "BigNumber",
              hex: "0x02",
            },
            {
              type: "BigNumber",
              hex: "0x04",
            },
            "0x3c8D9f130970358b7E8cbc1DbD0a1EbA6EBE368F",
            {
              type: "BigNumber",
              hex: "0x0184f44c5898",
            },
            "0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85",
            {
              type: "BigNumber",
              hex: "0x00",
            },
          ],
          event: "SoulboundCreditScoreMinted",
          eventSignature:
            "SoulboundCreditScoreMinted(uint256,uint256,address,uint256,address,uint256)",
        },
      ],
    };

    const creditScoreUpdateResponse = await masa.client.updateCreditScore(
      recipe
    );

    console.log({ creditScoreUpdateResponse });

    // }
  }
};
