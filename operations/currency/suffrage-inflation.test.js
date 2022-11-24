import bs58 from "bs58";

import { Amount } from "./amount";

import {
	SuffrageInflationFact,
	SuffrageInflationItem,
} from "./suffrage-inflation";
import { Operation } from "../operation";

import { TEST_GENESIS, TEST_NODE } from "../../mitum.config";

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
			"2022-11-16T06:55:02.135231Z",
			items
		);
		const operation = new Operation(fact, "", []);
		operation.sign(TEST_NODE.ecdsa);

		expect("FcP5ciHKkhogkskiYiaVCTP4JZ7zr4UH2cMRJqhhzEgV").toBe(
			bs58.encode(fact.hash)
		);
	});

	it("case: schnorr; operation", () => {});
});
