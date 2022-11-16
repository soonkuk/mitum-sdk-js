import bs58 from "bs58";

import { CurrencyItem } from "./item.js";

import { Fact } from "../fact.js";
import { Operation } from "../operation.js";

import { MAX_ITEMS_IN_FACT } from "../../mitum.config.js";
import {
	HINT_CREATE_CONTRACT_ACCOUNTS_ITEM_MUL_AMOUNTS,
	HINT_CREATE_CONTRACT_ACCOUNTS_ITEM_SIN_AMOUNT,
	HINT_CREATE_CONTRACT_ACCOUNTS_OPERATION,
	HINT_CREATE_CONTRACT_ACCOUNTS_OPERATION_FACT,
} from "../../alias/currency-extension.js";

import {
	assert,
	EC_INVALID_ITEM,
	EC_INVALID_ITEMS,
	EC_INVALID_KEYS,
	InvalidInstanceError,
	InvalidRangeError,
	InvalidTypeError,
} from "../../base/error.js";

import { Keys } from "../../key/key.js";
import { Address } from "../../key/address.js";

import { jsonStringify } from "../../utils/json.js";
import { name, sortBuf } from "../../utils/string.js";

export class CreateContractAccountsItem extends CurrencyItem {
	constructor(keys, amounts) {
		super(
			Array.isArray(amounts) && amounts.length > 1
				? HINT_CREATE_CONTRACT_ACCOUNTS_ITEM_MUL_AMOUNTS
				: HINT_CREATE_CONTRACT_ACCOUNTS_ITEM_SIN_AMOUNT,
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
			Buffer.concat(this.amounts.sort(sortBuf).map((amt) => amt.bytes())),
		]);
	}

	dict() {
		return {
			_hint: this.hint.toString(),
			keys: this.keys.dict(),
			amounts: this.amounts.sort(sortBuf).map((amount) => amount.dict()),
		};
	}
}

export class CreateContractAccountsFact extends Fact {
	constructor(token, sender, items) {
		super(HINT_CREATE_CONTRACT_ACCOUNTS_OPERATION_FACT, token);
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
				item instanceof CreateContractAccountsItem,
				new InvalidInstanceError(
					"not CreateContractAccountsItem instance",
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
			Buffer.concat(this.items.sort(sortBuf).map((item) => item.bytes())),
		]);
	}

	dict() {
		return {
			_hint: this.hint.toString(),
			hash: bs58.encode(this.hash),
			token: this.token.toString(),
			sender: this.sender.toString(),
			items: this.items.sort(sortBuf).map((item) => item.dict()),
		};
	}
}

export class CreateContractAccountsOperation extends Operation {
	constructor(id, fact, memo, factSigns) {
		super(
			id,
			HINT_CREATE_CONTRACT_ACCOUNTS_OPERATION,
			fact,
			memo,
			factSigns
		);
	}
}
