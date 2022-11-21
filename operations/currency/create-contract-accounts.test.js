import bs58 from "bs58";

import { Amount } from "./amount";
import {
	CreateContractAccountsFact,
	CreateContractAccountsItem,
} from "./create-contract-accounts";
import { Operation } from "../operation";

import { TEST_ACCOUNT, TEST_GENESIS } from "../../mitum.config";

import { Keys, PublicKey } from "../../key/key";
import { TimeStamp } from "../../utils/time";

describe("test: create-contract-account", () => {
	it("case: ecdsa; operation", () => {
		const amounts = [new Amount("MCC", "1000"), new Amount("PEN", "1000")];
		const keys = new Keys([new PublicKey(TEST_ACCOUNT.public, 100)], 100);
		const item = new CreateContractAccountsItem(keys, amounts);
		const fact = new CreateContractAccountsFact(
			new TimeStamp("2022-11-16T06:59:44.986806Z").UTC(),
			TEST_GENESIS.ecdsa.address,
			[item]
		);
		const operation = new Operation(fact, "", []);
		operation.sign(TEST_GENESIS.ecdsa.private);

		expect(
			"79MQkuRZW26k4YXT7xhADF2JwJW4geMfFCVmwNcLsp4Q" ===
				bs58.encode(fact.hash)
		);
		expect(
			"3DoTQhHYhmtQt4qjQnq7p9TbYYh5x3UfoWBqyEovF7Qr" ===
				bs58.encode(operation.hash)
		);
		expect(TEST_ACCOUNT.address === keys.address.toString());
	});

	it("case: schnorr; operation", () => {});
});
