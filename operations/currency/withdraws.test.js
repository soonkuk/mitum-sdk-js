import axios from "axios";

import { Amount } from "./amount";
import { WithdrawsFact, WithdrawsItem, WithdrawsOperation } from "./withdraws";

import { TEST_NODE } from "../../mitum.config";

import { ecdsa } from "../../key/ecdsa-keypair";
import { ecdsaRandomN } from "../../key/address";

import { TimeStamp } from "../../utils/time";

const { url, builder } = TEST_NODE;

const id = "mitum";

describe("test: withdraw", () => {
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
					new WithdrawsItem(
						ecdsaRandomN(1).keys.address.toString(),
						amounts
					)
				);
			}

			const fact = new WithdrawsFact(
				new TimeStamp().UTC(),
				ecdsaRandomN(1).keys.address.toString(),
				items
			);
			const operation = new WithdrawsOperation(id, fact, "", []);
			operation.sign(ecdsa.random().privateKey.toString());

			axios
				.post(`${url}${builder}`, operation.dict())
				.then((res) => expect(res.status === 200))
				.catch((_) => expect(false));
		}
	});

	it("case: schnorr; operation", () => {});
});
