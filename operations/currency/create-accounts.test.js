import axios from "axios";

import { Amount } from "./amount";
import {
	CreateAccountsFact,
	CreateAccountsItem,
	CreateAccountsOperation,
} from "./create-accounts";

import {
	MAX_THRESHOLD,
	MAX_WEIGHT,
	TEST_GENESIS,
	TEST_NODE,
} from "../../mitum.config";

import { ecdsa } from "../../key/ecdsa-keypair";
import { Keys, PublicKey } from "../../key/key";

import { TimeStamp } from "../../utils/time";

const { url, builder } = TEST_NODE;
const { key, address } = TEST_GENESIS.ecdsa;

const id = "mitum";

describe("test: create-account", () => {
	it("case: ecdsa; operation", () => {
		const currency = "MCC";
		const testAmount = "100";

		for (let i = 0; i < 10; i++) {
			const items = [];
			for (let j = 0; j < i + 1; j++) {
				const amounts = [];
				const keys = [];
				for (let k = 10 - i; k > 0; k--) {
					amounts.push(new Amount(currency, testAmount));
					keys.push(
						new PublicKey(
							ecdsa.random().publicKey.toString(),
							MAX_WEIGHT
						)
					);
				}
				items.push(
					new CreateAccountsItem(
						new Keys(keys, MAX_THRESHOLD),
						amounts
					)
				);
			}

			const fact = new CreateAccountsFact(
				new TimeStamp().UTC(),
				address,
				items
			);
			const operation = new CreateAccountsOperation(id, fact, "", []);
			operation.sign(key);

			axios
				.post(`${url}${builder}`, operation.dict())
				.then((res) => expect(res.status === 200))
				.catch((err) => expect(err.response.status === 200));
		}
	});

	it("case: schnorr; operation", () => {});
});
