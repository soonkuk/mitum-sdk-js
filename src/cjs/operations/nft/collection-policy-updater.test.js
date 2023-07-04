const bs58 = require("bs58");

const { Operation } = require("../operation.js");

const { CollectionPolicyUpdaterFact } = require("./collection-policy-updater");
const { TEST_GENESIS, TEST_ACCOUNT } = require("../../mitum.config");

describe("test: collection-policy-updater", () => {
	// test with mitum m2 keys
	it("case: m2", () => {
		const fact = new CollectionPolicyUpdaterFact(
			"2022-11-16T06:05:14.889691Z",
			TEST_GENESIS.m2.address,
			TEST_ACCOUNT.address,
			"PROTOCON",
			"PROTOCON",
			10,
			"https://example.com",
			[],
			"PEN"
		);
		const operation = new Operation(fact, "");
		operation.sign(TEST_GENESIS.m2.private, null);

		expect(bs58.encode(fact.hash)).toBe("HWHnoeGoUsm7c226NbJDj3JyhsnRkLspx84kNyM6vcmH");
	});
});
