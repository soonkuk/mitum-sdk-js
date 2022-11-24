import bs58 from "bs58";

import { KeyUpdaterFact } from "./key-updater";
import { Operation } from "../operation";

import { TEST_GENESIS, TEST_ACCOUNT } from "../../mitum.config";

import { Keys, PublicKey } from "../../key/key";

describe("test: key-updater", () => {
	it("case: ecdsa; operation", () => {
		const keys = new Keys([new PublicKey(TEST_ACCOUNT.public, 100)], 100);

		const fact = new KeyUpdaterFact(
			"2022-11-16T06:16:51.97284Z",
			TEST_GENESIS.ecdsa.address,
			keys,
			"MCC"
		);
		const operation = new Operation(fact, "", []);
		operation.sign(TEST_GENESIS.ecdsa.private);

		expect("8o6KNp9rvbmed783f38mnVPb3ss1Q2sZFYj9MpRy9Axa").toBe(
			bs58.encode(fact.hash)
		);
		expect(TEST_ACCOUNT.address).toBe(keys.address.toString());
	});

	it("case: schnorr; operation", () => {});
});
