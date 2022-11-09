import axios from "axios";

import { KeyUpdaterFact, KeyUpdaterOperation } from "./key-updater";

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

describe("test: key-updater", () => {
	it("case: ecdsa; operation", () => {
		const currency = "MCC";

		for (let i = 0; i < 10; i++) {
			const keys = [];
			for (let j = 10 - i; j > 0; j--) {
				keys.push(
					new PublicKey(
						ecdsa.random().publicKey.toString(),
						MAX_WEIGHT
					)
				);
			}

			const fact = new KeyUpdaterFact(
				new TimeStamp().UTC(),
				address,
				new Keys(keys, MAX_THRESHOLD),
				currency
			);
			const operation = new KeyUpdaterOperation(id, fact, "", []);
			operation.sign(key);

			axios
				.post(`${url}${builder}`, operation.dict())
				.then((res) => expect(res.status === 200))
				.catch((_) => expect(false));
		}
	});

	it("case: schnorr; operation", () => {});
});
