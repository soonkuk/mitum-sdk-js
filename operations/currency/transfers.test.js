import bs58 from "bs58";

import { Amount } from "./amount";
import { TransfersFact, TransfersItem } from "./transfers";
import { Operation } from "../operation";

import { TEST_ACCOUNT, TEST_GENESIS } from "../../mitum.config";

describe("test: transfers", () => {
	it("case: ecdsa; operation", () => {
		const amounts = [new Amount("MCC", "1000"), new Amount("PEN", "1000")];
		const item = new TransfersItem(TEST_ACCOUNT.address, amounts);
		const fact = new TransfersFact(
			"2022-11-16T06:26:07.47499Z",
			TEST_GENESIS.ecdsa.address,
			[item]
		);

		const operation = new Operation(fact, "", []);
		operation.sign(TEST_GENESIS.ecdsa.private);

		expect("GTXjBCvb183KaCtiprpjC4e4XDor6XeBfijZfqwMPsBx").toBe(
			bs58.encode(fact.hash)
		);
	});

	it("case: schnorr; operation", () => {});
});
