const bs58 = require("bs58");

const { Operation } = require("../operation.js");

const { MintItem, MintFact} = require("./mint.js");
const { NFTSigner, NFTSigners } = require("./nft-sign.js");
const { TEST_GENESIS, TEST_ACCOUNT, TEST_ACCOUNT_R } = require("../../mitum.config.js");

describe("test: mint", () => {
	// test with mitum m2 keys
	it("case: m2", () => {
		const items = [new MintItem(
			TEST_ACCOUNT.address,
			"PROTOCON",
			"abcdef", "https://example.com", new NFTSigners(100, [new NFTSigner(TEST_ACCOUNT_R.address, 100)]),
			"PEN",
		)];
		const fact = new MintFact(
			"2022-11-16T06:05:14.889691Z",
			TEST_GENESIS.m2.address,
			items
		);
		const operation = new Operation(fact, "");
		operation.sign(TEST_GENESIS.m2.private, null);

		expect(bs58.encode(fact.hash)).toBe("FvzRpxRGxcqtjgr8XJ8hf7ig2V2SDUz4PUPkzSJfSUa9");
	});
});
