const { Address } = require("../../key/address.js");
const { OperationFact } = require("../fact.js");
const { error, assert } = require("../../base/error.js");
const { Big } = require("../../utils/number.js");

const { NFTItem } = require("./item.js");

const {
	HINT_NFT_TRANSFER_ITEM,
	HINT_NFT_TRANSFER_OPERATION,
	HINT_NFT_TRANSFER_OPERATION_FACT,
} = require("../../alias/nft.js");

const { NFTID } = require("../../base/nft-id.js");
const { EC_INVALID_ITEM, EC_INVALID_ITEMS } = require("../../base/error.js");

class NFTTransferItem extends NFTItem {
	constructor(contract, collection, receiver, nft, currency) {
		super(HINT_NFT_TRANSFER_ITEM, contract, collection, currency);
		
		assert(contract !== receiver, error.runtime(EC_INVALID_ITEM, "contract == receiver"));
		this.receiver = new Address(receiver);

		this.nft = new Big(nft);
	}


	bytes() {
		return Buffer.concat([
			super.bytes(),
			this.receiver.bytes(),
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
			receiver: this.receiver.toString(),
			nft: this.nft.v,
		};
	}

    toString() {
        return this.nft.toString();
    }
}

class NFTTransferFact extends OperationFact {
	constructor(token, sender, items) {
		super(HINT_NFT_TRANSFER_OPERATION_FACT, token, sender, items);

		items.forEach((item) => {
			assert(
				item instanceof NFTTransferItem,
				error.instance(EC_INVALID_ITEM, `not NFTTransferItem instance`)
			);

			assert(item.contract.toString() !== sender, error.runtime(EC_INVALID_ITEM, "contract == sender"));
		});

		const iset = new Set(items.map(item => item.toString()));
		assert(iset.size === items.length, error.duplicate(EC_INVALID_ITEMS, "duplicate nft found"));
	}

	get opHint() {
		return HINT_NFT_TRANSFER_OPERATION;
	}
}

module.exports = {
	NFTTransferItem,
	NFTTransferFact,
};
