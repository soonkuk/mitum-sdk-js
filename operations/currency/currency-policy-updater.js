import bs58 from "bs58";

import { CurrencyPolicy } from "./currency-design.js";

import { Fact } from "../fact.js";
import { Operation } from "../operation.js";

import {
	HINT_CURRENCY_POLICY_UPDATER_OPERATION,
	HINT_CURRENCY_POLICY_UPDATER_OPERATION_FACT,
} from "../../alias/currency.js";

import { assert, error, EC_INVALID_CURRENCY_POLICY } from "../../base/error.js";
import { CurrencyID } from "../../base/ID.js";

import { name } from "../../utils/string.js";

export class CurrencyPolicyUpdaterFact extends Fact {
	constructor(token, currency, policy) {
		super(HINT_CURRENCY_POLICY_UPDATER_OPERATION_FACT, token);
		this.currency = new CurrencyID(currency);

		assert(
			policy instanceof CurrencyPolicy,
			error.instance(
				EC_INVALID_CURRENCY_POLICY,
				"not CurrencyPolicy",
				name(policy)
			)
		);
		this.policy = policy;
		this.hash = this.hashing();
	}

	bytes() {
		return Buffer.concat([
			this.token.bytes(),
			this.currency.bytes(),
			this.policy.bytes(),
		]);
	}

	dict() {
		return {
			_hint: this.hint.toString(),
			hash: bs58.encode(this.hash),
			token: this.token.toString(),
			currency: this.currency.toString(),
			policy: this.policy.dict(),
		};
	}

	get opHint() {
		return HINT_CURRENCY_POLICY_UPDATER_OPERATION;
	}
}
