import bs58 from "bs58";

import { Amount } from "./amount";
import { WithdrawsFact, WithdrawsItem, WithdrawsOperation } from "./withdraws";

import { TEST_ACCOUNT, TEST_GENESIS, TEST_ID } from "../../mitum.config";

import { TimeStamp } from "../../utils/time";

describe("test: withdraw", () => {
	it("case: ecdsa; operation", () => {
		const amounts = [new Amount("MCC", "1000"), new Amount("PEN", "1000")];
		const item = new WithdrawsItem(TEST_ACCOUNT.address, amounts);

		const fact = new WithdrawsFact(
			new TimeStamp("2022-11-16T07:03:47.411489Z").UTC(),
			TEST_GENESIS.ecdsa.address,
			[item]
		);
		const operation = new WithdrawsOperation(fact, "", []);
		operation.sign(TEST_GENESIS.ecdsa.private);

		expect(
			"ApAZLELnH8iYHtThDJk5dtr4Ni7TvDfJT4XHU4Z8gHM5" ===
				bs58.encode(fact.hash)
		);
		expect(
			"4fpWz4Pz4gPgDG3KKP52X3XTqD6Msbrb3az4P7W7c6oo" ===
				bs58.encode(operation.hash)
		);
	});

	it("case: schnorr; operation", () => {});
});
