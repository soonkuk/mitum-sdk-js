import bs58 from "bs58";

import { Amount } from "./amount";
import {
	CreateAccountsFact,
	CreateAccountsItem,
	CreateAccountsOperation,
} from "./create-accounts";

import { TEST_GENESIS, TEST_ACCOUNT, TEST_ID } from "../../mitum.config";

import { Keys, PublicKey } from "../../key/key";
import { TimeStamp } from "../../utils/time";

describe("test: create-account", () => {
	it("case: ecdsa; operation", () => {
		const amounts = [new Amount("MCC", "1000"), new Amount("PEN", "1000")];
		const keys = new Keys([new PublicKey(TEST_ACCOUNT.public, 100)], 100);
		const fact = new CreateAccountsFact(
			new TimeStamp("2022-11-16T06:05:14.889691Z").UTC(),
			TEST_GENESIS.ecdsa.address,
			[new CreateAccountsItem(keys, amounts)]
		);
		const operation = new CreateAccountsOperation(TEST_ID, fact, "", []);
		operation.sign(TEST_GENESIS.ecdsa.private);

		expect(
			"3YQ6tUgKBKq6HdjREeFTVBYrTDWiTQEYARv6HX8wyQZP" ===
				bs58.encode(fact.hash)
		);
		expect(
			"Gz3KHZ85jSWJ3yueMoHL4TU2f7TQV5N2Cz6FDMHRyvGJ" ===
				bs58.encode(operation.hash)
		);
		expect(TEST_ACCOUNT.address === keys.address.toString());
	});

	it("case: schnorr; operation", () => {});
});
