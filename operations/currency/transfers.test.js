import bs58 from "bs58";

import { Amount } from "./amount";
import { TransfersFact, TransfersItem, TransfersOperation } from "./transfers";

import { TEST_ACCOUNT, TEST_GENESIS, TEST_ID } from "../../mitum.config";

import { TimeStamp } from "../../utils/time";

describe("test: transfers", () => {
	it("case: ecdsa; operation", () => {
		const amounts = [new Amount("MCC", "1000"), new Amount("PEN", "1000")];
		const item = new TransfersItem(TEST_ACCOUNT.address, amounts);
		const fact = new TransfersFact(
			new TimeStamp("2022-11-16T06:26:07.47499Z").UTC(),
			TEST_GENESIS.ecdsa.address,
			[item]
		);

		const operation = new TransfersOperation(TEST_ID, fact, "", []);
		operation.sign(TEST_GENESIS.ecdsa.private);

		expect(
			"GTXjBCvb183KaCtiprpjC4e4XDor6XeBfijZfqwMPsBx" ===
				bs58.encode(fact.hash)
		);
		expect(
			"3YDbp8fSa46fhAdUnpk3u6JPCWGPSypUbTT2DE67Jiqj" ===
				bs58.encode(operation.hash)
		);
	});

	it("case: schnorr; operation", () => {});
});
