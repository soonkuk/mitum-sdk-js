import bs58 from "bs58";

import {
	CurrencyPolicy,
	FixedFeeer,
	NilFeeer,
	RatioFeeer,
} from "./currency-design";
import { CurrencyPolicyUpdaterFact } from "./currency-policy-updater";
import { Operation } from "../operation";

import { TEST_GENESIS, TEST_NODE } from "../../mitum.config";

describe("test: currency-policy-updater", () => {
	it("case: ecdsa; nil feeer", () => {
		const feeer = new NilFeeer();
		const policy = new CurrencyPolicy("33", feeer);

		const fact = new CurrencyPolicyUpdaterFact(
			"2022-11-16T06:46:44.06812Z",
			"PEN",
			policy
		);
		const operation = new Operation(fact, "", []);
		operation.sign(TEST_NODE.ecdsa);

		expect("5Mhz2DfpQ51G3SyNLcLgmCbp8yx5o53ykwre7DidT3Rr").toBe(
			bs58.encode(fact.hash)
		);
	});

	it("case: ecdsa; fixed feeer", () => {
		const feeer = new FixedFeeer(TEST_GENESIS.ecdsa.address, "999");
		const policy = new CurrencyPolicy("33", feeer);

		const fact = new CurrencyPolicyUpdaterFact(
			"2022-11-16T06:48:54.046555Z",
			"PEN",
			policy
		);
		const operation = new Operation(fact, "", []);
		operation.sign(TEST_NODE.ecdsa);

		expect("4n6AxV17j2oMmQhk1qMqTWzd3dUuEW45v88aLmisoCgy").toBe(
			bs58.encode(fact.hash)
		);
	});

	it("case: ecdsa; ratio feeer", () => {
		const feeer = new RatioFeeer(
			TEST_GENESIS.ecdsa.address,
			0.5,
			"1",
			"99"
		);
		const policy = new CurrencyPolicy("33", feeer);

		const fact = new CurrencyPolicyUpdaterFact(
			"2022-11-16T06:51:18.841996Z",
			"PEN",
			policy
		);
		const operation = new Operation(fact, "", []);
		operation.sign(TEST_NODE.ecdsa);

		expect("4h8RXMBj9qpEiWe3JrdnazhasuwVcBnyvVVNj8G3usrp").toBe(
			bs58.encode(fact.hash)
		);
	});

	it("case: schnorr; nil feeer", () => {});

	it("case: schnorr; fixed feeer", () => {});

	it("case: schnorr; ratio feeer", () => {});
});
