import bs58 from "bs58";

import { Amount } from "./amount";
import { TransfersFact, TransfersItem } from "./transfers";
import { Operation } from "../operation";

import { SIG_TYPE } from "../../utils/config";
import { TEST_ACCOUNT, TEST_ACCOUNT_R, TEST_GENESIS } from "../../mitum.config";

describe("test: transfers", () => {
	it("case: ecdsa; operation", () => {
		const amounts = [new Amount("MCC", "1000"), new Amount("PEN", "1000")];
		const item = new TransfersItem(TEST_ACCOUNT.address, amounts);
		const fact = new TransfersFact(
			"2022-11-16T06:26:07.47499Z",
			TEST_GENESIS.ecdsa.address,
			[item]
		);

		const operation = new Operation(fact, "");
		operation.sign(TEST_GENESIS.ecdsa.private, null);

		expect(bs58.encode(fact.hash)).toBe(
			"GTXjBCvb183KaCtiprpjC4e4XDor6XeBfijZfqwMPsBx"
		);
	});

	it("case: schnorr; operation", () => {
		const amounts = [new Amount("MCC", "1000")];
		const item = new TransfersItem(TEST_ACCOUNT_R.address, amounts);
		const fact = new TransfersFact(
			"2022-11-19 23:44:30.883651 +0000 UTC",
			TEST_GENESIS.schnorr.address,
			[item]
		);

		const operation = new Operation(fact, "");
		operation.sigType = SIG_TYPE.M2;
		operation.sign(TEST_GENESIS.schnorr.private, null);

		expect(bs58.encode(fact.hash)).toBe(
			"k1vnR6xnWBPoehfZGcbnfXBD8yZRmT4jsGfquRUPzjx"
		);
	});
});
