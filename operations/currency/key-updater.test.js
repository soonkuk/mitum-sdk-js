import bs58 from "bs58";

import { KeyUpdaterFact, KeyUpdaterOperation } from "./key-updater";

import {
	TEST_GENESIS,
	TEST_ACCOUNT,
	TEST_ID,
} from "../../mitum.config";

import { Keys, PublicKey } from "../../key/key";
import { TimeStamp } from "../../utils/time";

	// 		"_hint": "mitum-currency-keyupdater-operation-v0.0.1",
	// 		"hash": "9dg658G5HedDcSpN65cWD7UPCQD2HSvoShycx3cRwE6x",
	// 		"fact": {
	// 		  "_hint": "mitum-currency-keyupdater-operation-fact-v0.0.1",
	// 		  "hash": "",
	// 		  "token": "MjAyMi0xMS0xNlQwNjoxNjo1MS45NzI4NFo=",
	// 		  "target": "DBa8N5of7LZkx8ngH4mVbQmQ2NHDd6gL2mScGfhAEqddmca",
	// 		  "keys": {
	// 			"_hint": "mitum-currency-keys-v0.0.1",
	// 			"hash": "AN91jfkYtje64GPrKPkGMrrPnb7iq9TZq1fBHxwML9wm",
	// 			"keys": [
	// 			  {
	// 				"_hint": "mitum-currency-key-v0.0.1",
	// 				"weight": 100,
	// 				"key": "2122tJTiK183VbZFsecRgvaybcqM1wwGRLrsru9e5FaJMmpu"
	// 			  }
	// 			],
	// 			"threshold": 100
	// 		  },
	// 		  "currency": "MCC"
	// 		},
	// 		"fact_signs": [
	// 		  {
	// 			"_hint": "base-fact-sign-v0.0.1",
	// 			"signer": "zzeo6WAS4uqwCss4eRibtLnYHqJM21zhzPbKWQVPttxWmpu",
	// 			"signature": "AN1rKvtJFrckgFJAp6XVNbmPqBbbQrLb6fuNY2PLSfbtBKjwFve5hGkikWVxZeLBqg8XbMRJFyMa3ChXtG1pCWonP1va5ra6W",
	// 			"signed_at": "2022-11-16T06:16:51.972947Z"
	// 		  }
	// 		],
	// 		"memo": ""
	// 	  }

describe("test: key-updater", () => {
	it("case: ecdsa; operation", () => {
		const keys = new Keys([new PublicKey(
			TEST_ACCOUNT.public,
			100
		)], 100);

		const fact = new KeyUpdaterFact(
			new TimeStamp("2022-11-16T06:16:51.97284Z").UTC(),
			TEST_GENESIS.ecdsa.address,
			keys,
			"MCC"
		);
		const operation = new KeyUpdaterOperation(TEST_ID, fact, "", []);
		operation.sign(TEST_GENESIS.ecdsa.private);

		expect("8o6KNp9rvbmed783f38mnVPb3ss1Q2sZFYj9MpRy9Axa" === bs58.encode(fact.hash));
		expect("9dg658G5HedDcSpN65cWD7UPCQD2HSvoShycx3cRwE6x" === bs58.encode(operation.hash));
		expect(TEST_ACCOUNT.address === keys.address.toString());
	});

	it("case: schnorr; operation", () => {});
});
