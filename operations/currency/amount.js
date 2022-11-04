import { HINT_AMOUNT } from "../../alias/currency.js";

import { Hint } from "../../base/hint.js";
import { CurrencyID } from "../../base/ID.js";
import { IBytesDict } from "../../base/interface.js";
import {
	assert,
	EC_INVALID_AMOUNT,
	InvalidRangeError,
} from "../../base/error.js";

import Big from "../../utils/big.js";

export class Amount extends IBytesDict {
	constructor(currency, big) {
		super();
		this.hint = new Hint(HINT_AMOUNT);
		this.currency = new CurrencyID(currency);
		this.big = new Big(big);
		assert(
			this.big.big > 0,
			new InvalidRangeError(
				"zero amount",
				EC_INVALID_AMOUNT,
				this.big.toString()
			)
		);
	}

	bytes() {
		return Buffer.concat([this.big.bytes(), this.currency.bytes()]);
	}

	dict() {
		return {
			_hint: this.hint.toString(),
			currency: this.currency.toString(),
			amount: this.big.toString(),
		};
	}
}
