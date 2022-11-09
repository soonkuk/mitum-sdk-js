import axios from "axios";

import { Amount } from "./amount";

import { TEST_NODE } from "../../mitum.config";

import { ecdsaRandomN } from "../../key/address";
import { TimeStamp } from "../../utils/time";
import {
	SuffrageInflationFact,
	SuffrageInflationItem,
	SuffrageInflationOperation,
} from "./suffrage-inflation";

const { url, builder, key } = TEST_NODE;
const { ecdsa } = key;

const id = "mitum";
const currency = "MCC";
const amount = "99999999999999";

describe("test: suffrage-inflation", () => {
	it("case: ecdsa; operation", () => {
		for (let i = 0; i < 10; i++) {
			const items = [];
			for (let j = 0; j < i + 1; j++) {
				items.push(
					new SuffrageInflationItem(
						ecdsaRandomN(1).keys.address.toString(),
						new Amount(currency, amount)
					)
				);
			}

			const fact = new SuffrageInflationFact(
				new TimeStamp().UTC(),
				items
			);
			const operation = new SuffrageInflationOperation(id, fact, "", []);
			operation.sign(ecdsa);

			axios
				.post(`${url}${builder}`, operation.dict())
				.then((res) => expect(res.status === 200))
				.catch((_) => expect(false));
		}
	});

	it("case: schnorr; operation", () => {});
});
