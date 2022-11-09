import axios from "axios";

import { Amount } from "./amount";
import {
	TransfersFact,
	TransfersItem,
	TransfersOperation,
} from "./transfers";

import {
	TEST_GENESIS,
	TEST_NODE,
} from "../../mitum.config";

import { ecdsaRandomN } from "../../key/address";
import { TimeStamp } from "../../utils/time";

const { url, builder } = TEST_NODE;
const { key, address } = TEST_GENESIS.ecdsa;

const id = "mitum";

describe("test: transfers", () => {
	it("case: ecdsa; operation", () => {
		const currency = "MCC";
		const testAmount = "100";

		for (let i = 0; i < 10; i++) {
			const items = [];
			for (let j = 0; j < i + 1; j++) {
				const amounts = [];
				for (let k = 10 - i; k > 0; k--) {
					amounts.push(new Amount(currency, testAmount));
				}
				items.push(
					new TransfersItem(
						ecdsaRandomN(1).keys.address.toString(),
						amounts
					)
				);
			}

			const fact = new TransfersFact(
				new TimeStamp().UTC(),
				address,
				items
			);
			const operation = new TransfersOperation(id, fact, "", []);
			operation.sign(key);

			axios
				.post(`${url}${builder}`, operation.dict())
				.then((res) => expect(res.status === 200))
				.catch((_) => expect(false));
		}
	});

	it("case: schnorr; operation", () => {});
});
