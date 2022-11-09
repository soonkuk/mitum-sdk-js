import bs58 from "bs58";

import { Fact } from "../fact.js";
import { Operation } from "../operation.js";

import {
	HINT_KEY_UPDATER_OPERATION,
	HINT_KEY_UPDATER_OPERATION_FACT,
} from "../../alias/currency.js";

import {
	assert,
	EC_INVALID_KEYS,
	InvalidInstanceError,
} from "../../base/error.js";
import { CurrencyID } from "../../base/ID.js";

import { Keys } from "../../key/key.js";
import { Address } from "../../key/address.js";

import { name } from "../../utils/string.js";

export class KeyUpdaterFact extends Fact {
	constructor(token, target, keys, currency) {
		super(HINT_KEY_UPDATER_OPERATION_FACT, token);
		this.target = new Address(target);

		assert(
			keys instanceof Keys,
			new InvalidInstanceError(
				"not Keys instance",
				EC_INVALID_KEYS,
				name(keys)
			)
		);
		this.keys = keys;
		this.currency = new CurrencyID(currency);

		this.hash = this.hashing();
	}

	bytes() {
		return Buffer.concat([
			this.token.bytes(),
			this.target.bytes(),
			this.keys.bytes(),
			this.currency.bytes(),
		]);
	}

	dict() {
		return {
			_hint: this.hint.toString(),
			hash: bs58.encode(this.hash),
			token: this.token.toString(),
			target: this.target.toString(),
			keys: this.keys.dict(),
			currency: this.currency.toString(),
		};
	}
}

export class KeyUpdaterOperation extends Operation {
	constructor(id, fact, memo, factSigns) {
		super(id, HINT_KEY_UPDATER_OPERATION, fact, memo, factSigns);
	}
}
