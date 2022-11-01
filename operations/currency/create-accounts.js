import { MAX_ITEMS_IN_FACT } from "../../mitum.config.js"

import bs58 from "bs58";

import {
	HINT_CREATE_ACCOUNTS_ITEM_MUL_AMOUNTS,
	HINT_CREATE_ACCOUNTS_ITEM_SIN_AMOUNT,
	HINT_CREATE_ACCOUNTS_OPERATION,
	HINT_CREATE_ACCOUNTS_OPERATION_FACT,
} from "../../alias/currency.js";
import {
	assert,
	EC_INVALID_ITEM,
	EC_INVALID_ITEMS,
	EC_INVALID_KEYS,
	InvalidInstanceError,
	InvalidRangeError,
	InvalidTypeError,
} from "../../base/error.js";

import { Address } from "../../key/address.js";
import { Keys } from "../../key/key.js";
import { jsonStringify } from "../../utils/json.js";
import { name } from "../../utils/string.js";

import { Fact } from "../fact.js";
import { Operation } from "../operation.js";

import { CurrencyItem } from "./item.js";

export class CreateAccountsItem extends CurrencyItem {
	constructor(keys, amounts) {
		super(
			Array.isArray(amounts) && amounts.length > 1
				? HINT_CREATE_ACCOUNTS_ITEM_MUL_AMOUNTS
				: HINT_CREATE_ACCOUNTS_ITEM_SIN_AMOUNT,
			amounts
		);

		assert(
			keys instanceof Keys,
			new InvalidInstanceError(
				"not Keys instance",
				EC_INVALID_KEYS,
				name(keys)
			)
		);

		this.keys = keys;
	}

	bytes() {
		return Buffer.concat([
			this.keys.bytes(),
			Buffer.concat(this.amounts.map((amount) => amount.bytes())),
		]);
	}

	dict() {
		return {
			_hint: this.hint.toString(),
			keys: this.keys.dict(),
			amounts: this.amounts.map((amount) => amount.dict()),
		};
	}
}

export class CreateAccountsFact extends Fact {
	constructor(token, sender, items) {
		super(HINT_CREATE_ACCOUNTS_OPERATION_FACT, token);
		this.sender = new Address(sender);

		assert(
			Array.isArray(items),
			new InvalidTypeError(
				"not Array",
				EC_INVALID_ITEM,
				jsonStringify({
					type: typeof items,
					name: name(items),
				})
			)
		);
		assert(
			items.length > 0 && items.length <= MAX_ITEMS_IN_FACT,
			new InvalidRangeError(
				"array size out of range",
				EC_INVALID_ITEMS,
				items.length
			)
		);

		items.forEach((item, idx) =>
			assert(
				item instanceof CreateAccountsItem,
				new InvalidInstanceError(
					"not CreateAccountsItem instance",
					EC_INVALID_ITEM,
					`idx ${idx} - ${name(item)}`
				)
			)
		);

		this.items = items;
		this.hash = this.hashing();
	}

	bytes() {
		return Buffer.concat([
			this.token.bytes(),
			this.sender.bytes(),
			Buffer.concat(this.items.map((item) => item.bytes())),
		]);
	}

	dict() {
		return {
			_hint: this.hint.toString(),
			hash: bs58.encode(this.hash),
			token: this.token.toString(),
			sender: this.sender.toString(),
			items: this.items.map((item) => item.dict()),
		};
	}
}

export class CreateAccountsOperation extends Operation {
	constructor(id, fact, memo, factSigns) {
		super(id, HINT_CREATE_ACCOUNTS_OPERATION, fact, memo, factSigns);
	}
}
