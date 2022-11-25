import bs58 from "bs58";

import { CurrencyItem } from "./item.js";

import { Fact } from "../fact.js";

import { MAX_ITEMS_IN_FACT } from "../../mitum.config.js";
import {
	HINT_WITHDRAWS_ITEM_MUL_AMOUNTS,
	HINT_WITHDRAWS_ITEM_SIN_AMOUNT,
	HINT_WITHDRAWS_OPERATION,
	HINT_WITHDRAWS_OPERATION_FACT,
} from "../../alias/currency-extension.js";

import {
	assert,
	error,
	EC_INVALID_ITEM,
	EC_INVALID_ITEMS,
} from "../../base/error.js";

import { Address } from "../../key/address.js";

import { sortBuf } from "../../utils/string.js";

export class WithdrawsItem extends CurrencyItem {
	constructor(target, amounts) {
		super(
			Array.isArray(amounts) && amounts.length > 1
				? HINT_WITHDRAWS_ITEM_MUL_AMOUNTS
				: HINT_WITHDRAWS_ITEM_SIN_AMOUNT,
			amounts
		);
		this.target = new Address(target);
	}

	bytes() {
		return Buffer.concat([
			this.target.bytes(),
			Buffer.concat(this.amounts.sort(sortBuf).map((amt) => amt.bytes())),
		]);
	}

	dict() {
		return {
			_hint: this.hint.toString(),
			target: this.target.toString(),
			amounts: this.amounts.sort(sortBuf).map((amount) => amount.dict()),
		};
	}
}

export class WithdrawsFact extends Fact {
	constructor(token, sender, items) {
		super(HINT_WITHDRAWS_OPERATION_FACT, token);
		this.sender = new Address(sender);

		assert(Array.isArray(items), error.type(EC_INVALID_ITEM, "not Array"));

		assert(
			items.length > 0 && items.length <= MAX_ITEMS_IN_FACT,
			error.range(EC_INVALID_ITEMS, "array size out of range")
		);

		items.forEach((item, idx) =>
			assert(
				item instanceof WithdrawsItem,
				error.instance(EC_INVALID_ITEM, "not WithdrawsItem instance")
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
		return HINT_WITHDRAWS_OPERATION;
	}
}
