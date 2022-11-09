import axios from "axios";

import { Amount } from "./amount";
import {
	CurrencyDesign,
	CurrencyPolicy,
	FixedFeeer,
	NilFeeer,
	RatioFeeer,
} from "./currency-design";
import {
	CurrencyRegisterFact,
	CurrencyRegisterOperation,
} from "./currency-register";

import { TEST_NODE } from "../../mitum.config";

import { TimeStamp } from "../../utils/time";
import { ecdsaRandomN } from "../../key/address";

const { url, builder, key } = TEST_NODE;
const { ecdsa } = key;

const id = "mitum";
const currency = "MCC";

describe("test: currency-register", () => {
	it("case: ecdsa; nil feeer", () => {
		const feeer = new NilFeeer();
		const policy = new CurrencyPolicy("33", feeer);

		const amount = new Amount(currency, "9999999999999999999999999999999");
		const design = new CurrencyDesign(amount, ecdsaRandomN(1).keys.address.toString(), policy);

		const fact = new CurrencyRegisterFact(new TimeStamp().UTC(), design);
		const operation = new CurrencyRegisterOperation(id, fact, "", []);
		operation.sign(ecdsa);

		axios
			.post(`${url}${builder}`, operation.dict())
			.then((res) => expect(res.status === 200))
			.catch((_) => expect(false));
	});

	it("case: ecdsa; fixed feeer", () => {
		const feeer = new FixedFeeer(ecdsaRandomN(1).keys.address.toString(), "10");
		const policy = new CurrencyPolicy("33", feeer);

		const amount = new Amount(currency, "9999999999999999999999999999999");
		const design = new CurrencyDesign(amount, ecdsaRandomN(1).keys.address.toString(), policy);

		const fact = new CurrencyRegisterFact(new TimeStamp().UTC(), design);
		const operation = new CurrencyRegisterOperation(id, fact, "", []);
		operation.sign(ecdsa);

		axios
			.post(`${url}${builder}`, operation.dict())
			.then((res) => expect(res.status === 200))
			.catch((_) => expect(false));
	});

	it("case: ecdsa; ratio feeer", () => {
		const feeer = new RatioFeeer(ecdsaRandomN(1).keys.address.toString(), 0.5, "1", "10");
		const policy = new CurrencyPolicy("33", feeer);

		const amount = new Amount(currency, "9999999999999999999999999999999");
		const design = new CurrencyDesign(amount, ecdsaRandomN(1).keys.address.toString(), policy);

		const fact = new CurrencyRegisterFact(new TimeStamp().UTC(), design);
		const operation = new CurrencyRegisterOperation(id, fact, "", []);
		operation.sign(ecdsa);

		axios
			.post(`${url}${builder}`, operation.dict())
			.then((res) => expect(res.status === 200))
			.catch((_) => expect(false));
	});

	it("case: schnorr; nil feeer", () => {});

	it("case: schnorr; fixed feeer", () => {});

	it("case: schnorr; ratio feeer", () => {});
});
