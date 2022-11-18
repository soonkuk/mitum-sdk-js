import bs58 from "bs58";

import { CurrencyDesign } from "./currency-design.js";

import { Fact } from "../fact.js";
import { Operation } from "../operation.js";

import {
	HINT_CURRENCY_REGISTER_OPERATION,
	HINT_CURRENCY_REGISTER_OPERATION_FACT,
} from "../../alias/currency.js";

import { assert, error, EC_INVALID_CURRENCY_DESIGN } from "../../base/error.js";

import { name } from "../../utils/string.js";

export class CurrencyRegisterFact extends Fact {
	constructor(token, design) {
		super(HINT_CURRENCY_REGISTER_OPERATION_FACT, token);
		assert(
			design instanceof CurrencyDesign,
			error.instance(
				EC_INVALID_CURRENCY_DESIGN,
				"not CurrencyDesign instance",
				name(design)
			)
		);
		this.design = design;
		this.hash = this.hashing();
	}

	bytes() {
		return Buffer.from([this.token.bytes(), this.design.bytes()]);
	}

	dict() {
		return {
			_hint: this.hint.toString(),
			hash: bs58.encode(this.hash),
			token: this.token.toString(),
			currency: this.design.dict(),
		};
	}
}

export class CurrencyRegisterOperation extends Operation {
	constructor(id, fact, memo, factSigns) {
		super(id, HINT_CURRENCY_REGISTER_OPERATION, fact, memo, factSigns);
	}
}
