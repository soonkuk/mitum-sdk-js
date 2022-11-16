import bs58 from "bs58";

import { Amount } from "./amount";

import {
	SuffrageInflationFact,
	SuffrageInflationItem,
	SuffrageInflationOperation,
} from "./suffrage-inflation";

import { TEST_GENESIS, TEST_ID, TEST_NODE } from "../../mitum.config";

import { TimeStamp } from "../../utils/time";

describe("test: suffrage-inflation", () => {
	it("case: ecdsa; operation", () => {
		const items = [
			new SuffrageInflationItem(
				TEST_GENESIS.ecdsa.address,
				new Amount("MCC", "9999999999999999999999")
			),
			new SuffrageInflationItem(
				TEST_GENESIS.ecdsa.address,
				new Amount("PEN", "9999999999999999999999")
			),
		];

		const fact = new SuffrageInflationFact(
			new TimeStamp("2022-11-16T06:55:02.135231Z").UTC(),
			items
		);
		const operation = new SuffrageInflationOperation(TEST_ID, fact, "", []);
		operation.sign(TEST_NODE.ecdsa);

		expect(
			"FcP5ciHKkhogkskiYiaVCTP4JZ7zr4UH2cMRJqhhzEgV" ===
				bs58.encode(fact.hash)
		);
		expect(
			"C1LSS52mQJ1MJWq4GK3mpk6xpKMeLhST9kKjWYyKLrqK" ===
				bs58.encode(operation.hash)
		);
	});

	it("case: schnorr; operation", () => {});
});
