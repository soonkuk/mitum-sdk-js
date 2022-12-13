import bs58 from "bs58";

import { TEST_ACCOUNT, TEST_GENESIS } from "../mitum.config";

import { FactSign } from "./factsign";
import { Operation } from "./operation";

import { Amount } from "./currency/amount";
import { TransfersFact, TransfersItem } from "./currency/transfers";

describe("test: operation", () => {
	it("case: memo", () => {
		const item = new TransfersItem(TEST_ACCOUNT.address, [
			new Amount("MCC", "10000000"),
		]);
		const fact = new TransfersFact(
			"2022-12-13 03:24:26.767983 +0000 UTC",
			TEST_GENESIS.schnorr.address,
			[item]
		);
		const fs = new FactSign(
			"kYJADZP1XKNvUNn7XHY39yisp9QCfU1LtyxGw2HRjQwXmpu",
			Buffer.from(
				bs58.decode(
					"AN1rKvsyryVhAw4dXZfWSRXfiFhWuvbtV9mcDLf9WRq8MhfrjdpXjBzC1nxgMyDmSL9FhjCohhcJukfLviJYqpKBDo5Jm2SxD"
				)
			),
			"2022-12-13T03:24:26.768075Z"
		);
		const op = new Operation(fact, "transfers test", [fs]);
		op.forceExtendedMessage = true;

		expect(bs58.encode(fact.hash)).toBe(
			"Dct6c9pDynFzfc5N4Lcot3LJXwkjuDgQt2okzgnPpT2H"
		);
		expect(bs58.encode(op.hash)).toBe(
			"A88QiicaVofkeDMZq172W9DsaxwWF7PpnuLGSzQzoU1r"
		);
	});
});

