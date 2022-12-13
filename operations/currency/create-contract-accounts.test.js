import bs58 from "bs58";

import { Amount } from "./amount";
import {
	CreateContractAccountsFact,
	CreateContractAccountsItem,
} from "./create-contract-accounts";
import { Operation } from "../operation";

import { TEST_ACCOUNT, TEST_GENESIS } from "../../mitum.config";

import { Keys, PublicKey } from "../../key/key";

describe("test: create-contract-account", () => {
	it("case: ecdsa; operation", () => {
		const amounts = [new Amount("MCC", "1000"), new Amount("PEN", "1000")];
		const keys = new Keys([new PublicKey(TEST_ACCOUNT.public, 100)], 100);
		const item = new CreateContractAccountsItem(keys, amounts);
		const fact = new CreateContractAccountsFact(
			"2022-11-16T06:59:44.986806Z",
			TEST_GENESIS.ecdsa.address,
			[item]
		);
		const operation = new Operation(null, fact, "");
		operation.sign(TEST_GENESIS.ecdsa.private);

		expect(bs58.encode(fact.hash)).toBe(
			"79MQkuRZW26k4YXT7xhADF2JwJW4geMfFCVmwNcLsp4Q"
		);
		expect(keys.address.toString()).toBe(TEST_ACCOUNT.address);
	});

	it("case: schnorr; operation", () => {});
});
