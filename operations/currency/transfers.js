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
	EC_INVALID_ITEM,
	EC_INVALID_ITEMS,
	InvalidInstanceError,
	InvalidRangeError,
	InvalidTypeError,
} from "../../base/error.js";

import { Address } from "../../key/address.js";

import { jsonStringify } from "../../utils/json.js";
import { name, sortStringAsBuf } from "../../utils/string.js";

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
			Buffer.concat(
				this.amounts.sort(sortStringAsBuf).map((amt) => amt.bytes())
			),
		]);
	}

	dict() {
		return {
			_hint: this.hint.toString(),
			receiver: this.receiver.toString(),
			amounts: this.amounts.map((amount) => amount.dict()),
		};
	}
}

export class TransfersFact extends Fact {
	constructor(token, sender, items) {
		super(HINT_TRANSFERS_OPERATION_FACT, token);
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
				item instanceof TransfersItem,
				new InvalidInstanceError(
					"not TransfersItem instance",
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

export class TransfersOperation extends Operation {
	constructor(id, fact, memo, factSigns) {
		super(id, HINT_TRANSFERS_OPERATION, fact, memo, factSigns);
	}
}
