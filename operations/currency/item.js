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

export class CurrencyItem extends Item {
	constructor(hint, amounts) {
		super(hint);

		assert(
			Array.isArray(amounts),
			error.type(EC_INVALID_ITEM, "not Array")
		);
		assert(
			amounts.length > 0 && amounts.length <= MAX_AMOUNTS_IN_ITEM,
			error.range(EC_INVALID_AMOUNTS, "array size out of range")
		);
		amounts.forEach((amount) => {
			assert(
				amount instanceof Amount,
				error.instance(EC_INVALID_AMOUNT, "not Amount instance")
			);
		});

		this.amounts = amounts;
	}
}
