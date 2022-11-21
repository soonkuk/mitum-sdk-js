import bs58 from "bs58";

import {
	CurrencyPolicy,
	FixedFeeer,
	NilFeeer,
	RatioFeeer,
} from "./currency-design";
import {
	CurrencyPolicyUpdaterFact,
	CurrencyPolicyUpdaterOperation,
} from "./currency-policy-updater";

import { TEST_GENESIS, TEST_NODE } from "../../mitum.config";

import { TimeStamp } from "../../utils/time";

describe("test: currency-policy-updater", () => {
	it("case: ecdsa; nil feeer", () => {
		const feeer = new NilFeeer();
		const policy = new CurrencyPolicy("33", feeer);

		const fact = new CurrencyPolicyUpdaterFact(
			new TimeStamp("2022-11-16T06:46:44.06812Z").UTC(),
			"PEN",
			policy
		);
		const operation = new CurrencyPolicyUpdaterOperation(fact, "", []);
		operation.sign(TEST_NODE.ecdsa);

		expect(
			"5Mhz2DfpQ51G3SyNLcLgmCbp8yx5o53ykwre7DidT3Rr" ===
				bs58.encode(fact.hash)
		);
		expect(
			"2wMkQpezYUCUjpMxkjvqBDnbnt8adHxdbhkKPBv3cbjq" ===
				bs58.encode(operation.hash)
		);
	});

	it("case: ecdsa; fixed feeer", () => {
		const feeer = new FixedFeeer(TEST_GENESIS.ecdsa.address, "999");
		const policy = new CurrencyPolicy("33", feeer);

		const fact = new CurrencyPolicyUpdaterFact(
			new TimeStamp("2022-11-16T06:48:54.046555Z").UTC(),
			"PEN",
			policy
		);
		const operation = new CurrencyPolicyUpdaterOperation(fact, "", []);
		operation.sign(TEST_NODE.ecdsa);

		expect(
			"4n6AxV17j2oMmQhk1qMqTWzd3dUuEW45v88aLmisoCgy" ===
				bs58.encode(fact.hash)
		);
		expect(
			"FrkAgdYuYrnBMFXJqvNUKsJym1w5AbwuM5Gajy7E16Ec" ===
				bs58.encode(operation.hash)
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
			new TimeStamp("2022-11-16T06:51:18.841996Z").UTC(),
			"PEN",
			policy
		);
		const operation = new CurrencyPolicyUpdaterOperation(fact, "", []);
		operation.sign(TEST_NODE.ecdsa);

		expect(
			"4h8RXMBj9qpEiWe3JrdnazhasuwVcBnyvVVNj8G3usrp" ===
				bs58.encode(fact.hash)
		);
		expect(
			"3YtRVksiyr4bCWeYXP4dFjAm8YzTj2HYf1PEpqdWZvu8" ===
				bs58.encode(operation.hash)
		);
	});

	it("case: schnorr; nil feeer", () => {});

	it("case: schnorr; fixed feeer", () => {});

	it("case: schnorr; ratio feeer", () => {});
});
