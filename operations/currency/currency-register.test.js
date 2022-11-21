import bs58 from "bs58";

import { Amount } from "./amount";
import {
	CurrencyDesign,
	CurrencyPolicy,
	FixedFeeer,
	NilFeeer,
	RatioFeeer,
} from "./currency-design";
import { CurrencyRegisterFact } from "./currency-register";
import { Operation } from "../operation";

import { TEST_GENESIS, TEST_NODE } from "../../mitum.config";

import { TimeStamp } from "../../utils/time";

describe("test: currency-register", () => {
	it("case: ecdsa; nil feeer", () => {
		const feeer = new NilFeeer();
		const policy = new CurrencyPolicy("33", feeer);

		const amount = new Amount("PEN", "99999999999999999999999");
		const design = new CurrencyDesign(
			amount,
			TEST_GENESIS.ecdsa.address,
			policy
		);

		const fact = new CurrencyRegisterFact(
			new TimeStamp("2022-11-16T06:32:11.337619Z").UTC(),
			design
		);
		const operation = new Operation(fact, "", []);
		operation.sign(TEST_NODE.ecdsa);

		expect(
			"CP2cAeN9wLj7BygR8KGt3FAH11vhRFVYc4togf5s9nYL" ===
				bs58.encode(fact.hash)
		);
		expect(
			"6U4p4RzLPWHQxd6DWTXA6LLZ4uBcFpjq6wPSdcMGwKuN" ===
				bs58.encode(operation.hash)
		);
	});

	it("case: ecdsa; fixed feeer", () => {
		const feeer = new FixedFeeer(TEST_GENESIS.ecdsa.address, "999");
		const policy = new CurrencyPolicy("33", feeer);

		const amount = new Amount("PEN", "99999999999999999999999");
		const design = new CurrencyDesign(
			amount,
			TEST_GENESIS.ecdsa.address,
			policy
		);

		const fact = new CurrencyRegisterFact(
			new TimeStamp("2022-11-16T06:35:43.649604Z").UTC(),
			design
		);
		const operation = new Operation(fact, "", []);
		operation.sign(TEST_NODE.ecdsa);

		expect(
			"6j3PN6oPof46vyoUjDxMnEr5JCdco2b5USapBYLLf1xh" ===
				bs58.encode(fact.hash)
		);
		expect(
			"EqBuz16bhi9b9PsbgiSU7jX1ymo8HBypVoJqwS1V1ZPc" ===
				bs58.encode(operation.hash)
		);
	});

	it("case: ecdsa; ratio feeer", () => {
		const ratio = (n, token) => {
			const feeer = new RatioFeeer(
				TEST_GENESIS.ecdsa.address,
				n,
				"1",
				"99"
			);
			const policy = new CurrencyPolicy("33", feeer);

			const amount = new Amount("PEN", "99999999999999999999999");
			const design = new CurrencyDesign(
				amount,
				TEST_GENESIS.ecdsa.address,
				policy
			);

			const fact = new CurrencyRegisterFact(
				new TimeStamp(token).UTC(),
				design
			);
			const operation = new Operation(fact, "", []);
			operation.sign(TEST_NODE.ecdsa);

			return {
				fact: bs58.encode(fact.hash),
				operation: bs58.encode(operation.hash),
			};
		};

		const r0 = ratio(0, "2022-11-16T06:42:44.505842Z");
		const r1 = ratio(0.5, "2022-11-16T06:38:44.472Z");
		const r2 = ratio(1, "2022-11-16T06:44:19.856767Z");

		expect(r0.fact === "Dai6Wt9kqb8Mztt8uVspZZJYw3QsTmccxKQzqC5hPCCR");
		expect(r0.operation === "8D1LHkXCcEvMEGxwYqh3GD35bk3sNfCK9Qrd54tB5BkL");
		expect(r1.fact === "8RihHh7jYDcG8fMi1KHnVdm6YVHYiBKN3iVpvPoysPw2");
		expect(r1.operation === "8Axsww9aup1rWwp6CYnXdHE8F2t883H4KyDD9KAcgRBD");
		expect(r2.fact === "DLsvsfkRGpHXrMXSyxYMGGmT48Jhhuro4bVNSojHJ7DB");
		expect(r2.operation === "CmFNhH1aoiMSG1X6ArDDgP6DkUBoM2ALVFWKpN8gyaCi");
	});

	it("case: schnorr; nil feeer", () => {});

	it("case: schnorr; fixed feeer", () => {});

	it("case: schnorr; ratio feeer", () => {});
});
