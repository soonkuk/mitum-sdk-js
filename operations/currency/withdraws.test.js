import bs58 from "bs58";

import { Amount } from "./amount";
import { WithdrawsFact, WithdrawsItem } from "./withdraws";
import { Operation } from "../operation";

import { TEST_ACCOUNT, TEST_GENESIS } from "../../mitum.config";

describe("test: withdraw", () => {
	it("case: ecdsa; operation", () => {
		const amounts = [new Amount("MCC", "1000"), new Amount("PEN", "1000")];
		const item = new WithdrawsItem(TEST_ACCOUNT.address, amounts);

		const fact = new WithdrawsFact(
			"2022-11-16T07:03:47.411489Z",
			TEST_GENESIS.ecdsa.address,
			[item]
		);
		const operation = new Operation(fact, "");
		operation.sign(TEST_GENESIS.ecdsa.private, null);

		expect(bs58.encode(fact.hash)).toBe(
			"ApAZLELnH8iYHtThDJk5dtr4Ni7TvDfJT4XHU4Z8gHM5"
		);
	});

	it("case: schnorr; operation", () => {});
});
