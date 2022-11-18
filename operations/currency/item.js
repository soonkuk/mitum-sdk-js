import { Amount } from "./amount.js";

import { Item } from "../item.js";

import { MAX_AMOUNTS_IN_ITEM } from "../../mitum.config.js";
import {
	assert,
	error,
	EC_INVALID_AMOUNT,
	EC_INVALID_AMOUNTS,
	EC_INVALID_ITEM,
} from "../../base/error.js";

import { name } from "../../utils/string.js";
import { jsonStringify } from "../../utils/json.js";

export class CurrencyItem extends Item {
	constructor(hint, amounts) {
		super(hint);

		assert(
			Array.isArray(amounts),
			error.type(
				"not Array",
				EC_INVALID_ITEM,
				jsonStringify({
					type: typeof amounts,
					name: name(amounts),
				})
			)
		);
		assert(
			amounts.length > 0 && amounts.length <= MAX_AMOUNTS_IN_ITEM,
			error.range(
				"array size out of range",
				EC_INVALID_AMOUNTS,
				amounts.length
			)
		);
		amounts.forEach((amount) => {
			assert(
				amount instanceof Amount,
				error.instance(
					"not Amount instance",
					EC_INVALID_AMOUNT,
					name(amount)
				)
			);
		});

		this.amounts = amounts;
	}
}
