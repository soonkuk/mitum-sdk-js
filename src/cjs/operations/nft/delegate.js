const { Address } = require("../../key/address.js");
const { OperationFact } = require("../fact.js");
const { error, assert } = require("../../base/error.js");

const { NFTItem } = require("./item.js");

const {
	HINT_DELEGATE_ITEM,
	HINT_DELEGATE_OPERATION,
	HINT_DELEGATE_OPERATION_FACT,
} = require("../../alias/nft.js");

const { EC_INVALID_ITEM, EC_INVALID_ITEMS } = require("../../base/error.js");

const DELEGATE = {
	allow: "allow",
	cancel: "cancel",
}

class DelegateItem extends NFTItem {
	constructor(contract, collection, operator, mode, currency) {
		super(HINT_DELEGATE_ITEM, contract, collection, currency);
		
		assert(contract !== operator, error.runtime(EC_INVALID_ITEM, "contract == operator"));
		this.operator = new Address(operator);
		
		assert([DELEGATE.allow, DELEGATE.cancel].includes(mode), error.runtime(EC_INVALID_ITEM, "invalid delegate mode"));
		this.mode = mode;
	}

	bytes() {
		let b = Buffer.concat([
			super.bytes(),
			this.operator.bytes(),
			Buffer.from(this.mode),
			this.currency.bytes(),
		])

		return Buffer.concat([
			super.bytes(),
			this.operator.bytes(),
			Buffer.from(this.mode),
			this.currency.bytes(),
		]);
	}

	dict() {
		return {
			_hint: this.hint.toString(),
			contract: this.contract.toString(),
			collection: this.collection.toString(),
			currency: this.currency.toString(),
			operator: this.operator.toString(),
			mode: this.mode,
		};
	}

    toString() {
        return this.contract.toString() + this.collection.toString() + this.operator.toString();
    }
}

class DelegateFact extends OperationFact {
	constructor(token, sender, items) {
		super(HINT_DELEGATE_OPERATION_FACT, token, sender, items);

		items.forEach((item) => {
			assert(
				item instanceof DelegateItem,
				error.instance(EC_INVALID_ITEM, `not DelegateItem instance`)
			);

			assert(item.contract.toString() !== sender, error.runtime(EC_INVALID_ITEM, "contract == sender"));
		});

		const iset = new Set(items.map(item => item.toString()));
		assert(iset.size === items.length, error.duplicate(EC_INVALID_ITEMS, "duplicate contract-collection-operator found"));
	}

	get opHint() {
		return HINT_DELEGATE_OPERATION;
	}
}

module.exports = {
	DELEGATE,
    DelegateItem,
    DelegateFact,
};