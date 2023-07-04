const bs58 = require("bs58");

const { Operation } = require("../operation.js");

const { DelegateItem, DelegateFact, DELEGATE } = require("./delegate.js");
const { TEST_GENESIS, TEST_ACCOUNT, TEST_ACCOUNT_R } = require("../../mitum.config.js");

describe("test: delegate", () => {
	// test with mitum m2 keys
	it("case: m2", () => {
		const items = [new DelegateItem(
			TEST_ACCOUNT.address,
			"PROTOCON",
			TEST_ACCOUNT_R.address,
			DELEGATE.allow,
			"PEN"
		)];
		const fact = new DelegateFact(
			"2022-11-16T06:05:14.889691Z",
			TEST_GENESIS.m2.address,
			items
		);
		const operation = new Operation(fact, "");
		operation.sign(TEST_GENESIS.m2.private, null);

		expect(bs58.encode(fact.hash)).toBe("DaTVBhfVX9tgSdVjtSBSeCv5LmnveN4ENi66J95efy2W");
	});
});
