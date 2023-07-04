const bs58 = require("bs58");

const { Operation } = require("../operation.js");

const { ApproveItem, ApproveFact } = require("./approve.js");
const { TEST_GENESIS, TEST_ACCOUNT, TEST_ACCOUNT_R } = require("../../mitum.config");

describe("test: approve", () => {
	// test with mitum m2 keys
	it("case: m2", () => {
		const items = [new ApproveItem(
			TEST_ACCOUNT.address,
			"PROTOCON",
			TEST_ACCOUNT_R.address,
			1,
			"PEN",
		)];
		const fact = new ApproveFact(
			"2022-11-16T06:05:14.889691Z",
			TEST_GENESIS.m2.address,
			items
		);
		const operation = new Operation(fact, "");
		operation.sign(TEST_GENESIS.m2.private, null);

		expect(bs58.encode(fact.hash)).toBe("9K1AhMURFWoSb5NWG3nsZczRDEHVSP4py31jwAGPA8Kw");
	});
});
