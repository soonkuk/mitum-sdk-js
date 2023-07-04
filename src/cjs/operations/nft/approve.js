const { Address } = require("../../key/address.js");
const { OperationFact } = require("../fact.js");
const {
	error,
	assert,
	EC_INVALID_ITEM,
	EC_INVALID_ITEMS,
} = require("../../base/error.js");

const { NFTItem } = require("./item.js");

const {
	HINT_APPROVE_ITEM,
	HINT_APPROVE_OPERATION,
	HINT_APPROVE_OPERATION_FACT,
} = require("../../alias/nft.js");

const { Big } = require("../../utils/number.js");
const { NFTID } = require("../../base/nft-id.js");

class ApproveItem extends NFTItem {
	constructor(contract, collection, approved, nft, currency) {
		super(HINT_APPROVE_ITEM, contract, collection, currency);

		assert(this.contract.toString() !== approved, error.runtime(EC_INVALID_ITEM, "contract == approved"));

		this.approved = new Address(approved);
		this.nft = new Big(nft);
	}

	bytes() {
		return Buffer.concat([
			super.bytes(),
			this.approved.bytes(),
			this.nft.fillBytes(),
			this.currency.bytes(),
		]);
	}

	dict() {
		return {
			_hint: this.hint.toString(),
			contract: this.contract.toString(),
			collection: this.collection.toString(),
			currency: this.currency.toString(),
			approved: this.approved.toString(),
			nft: this.nft.v,
		};
	}

	toString() {
		return this.nft.toString();
	}
}

class ApproveFact extends OperationFact {
	constructor(token, sender, items) {
		super(HINT_APPROVE_OPERATION_FACT, token, sender, items);

		items.forEach((item) => {
			assert(
				item instanceof ApproveItem,
				error.instance(EC_INVALID_ITEM, `not ApproveItem instance`)
			);

			assert(item.contract.toString() !== sender, error.runtime(EC_INVALID_ITEM, "contract == sender"));
		});

		const iset = new Set(items.map(item => item.toString()));
		assert(iset.size === items.length, error.duplicate(EC_INVALID_ITEMS, "duplicate nft found"));
	}

	get opHint() {
		return HINT_APPROVE_OPERATION;
	}
}

module.exports = {
	ApproveItem,
	ApproveFact,	
};