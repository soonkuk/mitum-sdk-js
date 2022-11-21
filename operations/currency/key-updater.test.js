import bs58 from "bs58";

import { KeyUpdaterFact, KeyUpdaterOperation } from "./key-updater";

import { TEST_GENESIS, TEST_ACCOUNT } from "../../mitum.config";

import { Keys, PublicKey } from "../../key/key";
import { TimeStamp } from "../../utils/time";

describe("test: key-updater", () => {
	it("case: ecdsa; operation", () => {
		const keys = new Keys([new PublicKey(TEST_ACCOUNT.public, 100)], 100);

		const fact = new KeyUpdaterFact(
			new TimeStamp("2022-11-16T06:16:51.97284Z").UTC(),
			TEST_GENESIS.ecdsa.address,
			keys,
			"MCC"
		);
		const operation = new KeyUpdaterOperation(fact, "", []);
		operation.sign(TEST_GENESIS.ecdsa.private);

		expect(
			"8o6KNp9rvbmed783f38mnVPb3ss1Q2sZFYj9MpRy9Axa" ===
				bs58.encode(fact.hash)
		);
		expect(
			"9dg658G5HedDcSpN65cWD7UPCQD2HSvoShycx3cRwE6x" ===
				bs58.encode(operation.hash)
		);
		expect(TEST_ACCOUNT.address === keys.address.toString());
	});

	it("case: schnorr; operation", () => {});
});
