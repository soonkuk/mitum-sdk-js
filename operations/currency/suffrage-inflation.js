import bs58 from "bs58";

import { Amount } from "./amount.js";

import { Fact } from "../fact.js";
import { Operation } from "../operation.js";

import { MAX_ITEMS_IN_FACT } from "../../mitum.config.js";
import {
	HINT_SUFFRAGE_INFLATION_OPERATION,
	HINT_SUFFRAGE_INFLATION_OPERATION_FACT,
} from "../../alias/currency.js";

import {
	assert,
	error,
	EC_INVALID_AMOUNT,
	EC_INVALID_ITEM,
	EC_INVALID_ITEMS,
} from "../../base/error.js";
import { IBytesDict } from "../../base/interface.js";

import { Address } from "../../key/address.js";
import { name, sortBuf } from "../../utils/string.js";
import { jsonStringify } from "../../utils/json.js";

export class SuffrageInflationItem extends IBytesDict {
	constructor(receiver, amount) {
		super();
		assert(
			amount instanceof Amount,
			error.instance(
				EC_INVALID_AMOUNT,
				"not Amount instance",
				name(amount)
			)
		);
		this.amount = amount;
		this.receiver = new Address(receiver);
	}

	bytes() {
		return Buffer.concat([this.receiver.bytes(), this.amount.bytes()]);
	}

	dict() {
		return {
			receiver: this.receiver.toString(),
			amount: this.amount.dict(),
		};
	}
}

export class SuffrageInflationFact extends Fact {
	constructor(token, items) {
		super(HINT_SUFFRAGE_INFLATION_OPERATION_FACT, token);

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
				item instanceof SuffrageInflationItem,
				error.instance(
					EC_INVALID_ITEM,
					"not SuffrageInflationItem instance",
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
			Buffer.concat(this.items.sort(sortBuf).map((item) => item.bytes())),
		]);
	}

	dict() {
		return {
			_hint: this.hint.toString(),
			hash: bs58.encode(this.hash),
			token: this.token.toString(),
			items: this.items.sort(sortBuf).map((item) => item.dict()),
		};
	}
}

export class SuffrageInflationOperation extends Operation {
	constructor(id, fact, memo, factSigns) {
		super(id, HINT_SUFFRAGE_INFLATION_OPERATION, fact, memo, factSigns);
	}
}
