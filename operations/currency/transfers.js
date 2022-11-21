import bs58 from "bs58";

import { CurrencyItem } from "./item.js";

import { Fact } from "../fact.js";
import { Operation } from "../operation.js";

import { MAX_ITEMS_IN_FACT } from "../../mitum.config.js";
import {
	HINT_TRANSFERS_ITEM_MUL_AMOUNTS,
	HINT_TRANSFERS_ITEM_SIN_AMOUNT,
	HINT_TRANSFERS_OPERATION,
	HINT_TRANSFERS_OPERATION_FACT,
} from "../../alias/currency.js";

import {
	assert,
	error,
	EC_INVALID_ITEM,
	EC_INVALID_ITEMS,
} from "../../base/error.js";

import { Address } from "../../key/address.js";

import { jsonStringify } from "../../utils/json.js";
import { name, sortBuf } from "../../utils/string.js";

export class TransfersItem extends CurrencyItem {
	constructor(receiver, amounts) {
		super(
			Array.isArray(amounts) && amounts.length > 1
				? HINT_TRANSFERS_ITEM_MUL_AMOUNTS
				: HINT_TRANSFERS_ITEM_SIN_AMOUNT,
			amounts
		);
		this.receiver = new Address(receiver);
	}

	bytes() {
		return Buffer.concat([
			this.receiver.bytes(),
			Buffer.concat(this.amounts.sort(sortBuf).map((amt) => amt.bytes())),
		]);
	}

	dict() {
		return {
			_hint: this.hint.toString(),
			receiver: this.receiver.toString(),
			amounts: this.amounts.sort(sortBuf).map((amount) => amount.dict()),
		};
	}
}

export class TransfersFact extends Fact {
	constructor(token, sender, items) {
		super(HINT_TRANSFERS_OPERATION_FACT, token);
		this.sender = new Address(sender);

		assert(
			Array.isArray(items),
			error.type(
				EC_INVALID_ITEM,
				"not Array",
				jsonStringify({
					type: typeof items,
					name: name(items),
				})
			)
		);

		assert(
			items.length > 0 && items.length <= MAX_ITEMS_IN_FACT,
			error.range(
				EC_INVALID_ITEMS,
				"array size out of range",
				items.length
			)
		);

		items.forEach((item, idx) =>
			assert(
				item instanceof TransfersItem,
				error.instance(
					EC_INVALID_ITEM,
					"not TransfersItem instance",
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

	get opHint() {
		return HINT_TRANSFERS_OPERATION;
	}
}
