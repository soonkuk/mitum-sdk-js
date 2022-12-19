import { Seal } from "./seal";
import { Operation } from "./operation";

import { Amount } from "./currency/amount";
import { TransfersFact, TransfersItem } from "./currency/transfers";
import { TEST_ACCOUNT, TEST_GENESIS, TEST_NODE } from "../mitum.config";

import { SIG_TYPE } from "../utils/config";
import { TimeStamp } from "../utils/time";

describe("test: seal", () => {
	const amounts = [new Amount("MCC", "1000"), new Amount("PEN", "1000")];
	const item = new TransfersItem(TEST_ACCOUNT.address, amounts);
	const fact = new TransfersFact(
		new TimeStamp().UTC(),
		TEST_GENESIS.ecdsa.address,
		[item]
	);

	it("case: ecdsa; M1", () => {
		const operation = new Operation(fact, "");
		operation.sign(TEST_GENESIS.ecdsa.private, null);

		const seal = new Seal([operation]);
		expect(() => seal.sign(TEST_NODE.ecdsa)).not.toThrow(Error);
	});

	it("case: ecdsa; M2", () => {
		const operation = new Operation(fact, "");
		operation.sigType = SIG_TYPE.M2;
		operation.sign(TEST_GENESIS.ecdsa.private, null);

		expect(() => new Seal([operation])).toThrow(Error);
	});

	it("case: schnorr; M1", () => {
		const operation = new Operation(fact, "");
		operation.sign(TEST_GENESIS.schnorr.private, null);

		const seal = new Seal([operation]);
		expect(() => seal.sign(TEST_NODE.schnorr)).toThrow(Error);
	});

	it("case: schnorr; M2", () => {
		const operation = new Operation(fact, "");
		operation.sigType = SIG_TYPE.M2;
		operation.sign(TEST_GENESIS.schnorr.private, null);

		expect(() => new Seal([operation])).toThrow(Error);
	});

	it("case: schnorr; M2_NODE", () => {
		const operation = new Operation(fact, "");
		operation.sigType = SIG_TYPE.M2_NODE;
		operation.sign(TEST_NODE.schnorr, { node: "node0sas" });

		expect(() => new Seal([operation.dict()])).toThrow(Error);
	});
});
