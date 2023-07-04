const bs58 = require("bs58");

const { Operation } = require("../operation.js");
const { NFTSignItem, NFTSignFact} = require("./nft-sign.js");
const { TEST_GENESIS, TEST_ACCOUNT } = require("../../mitum.config.js");

describe("test: nft-sign", () => {
	// test with mitum m2 keys
	it("case: m2", () => {
		const items = [new NFTSignItem(
			TEST_ACCOUNT.address, "PROTOCON", 1, "PEN"
		)];
		const fact = new NFTSignFact(
			"2022-11-16T06:05:14.889691Z",
			TEST_GENESIS.m2.address,
			items
		);
		const operation = new Operation(fact, "");
		operation.sign(TEST_GENESIS.m2.private, null);

		expect(bs58.encode(fact.hash)).toBe("BRDg9ST7rNoNQDrGVA2vzc3KtdLnKzc8P6sm5zmyJ7rx");
	});
});
