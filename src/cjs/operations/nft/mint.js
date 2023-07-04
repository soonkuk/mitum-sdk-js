const { OperationFact } = require("../fact.js");
const { IBytes, IBytesDict } = require("../../base/interface.js");
const { error, assert } = require("../../base/error.js");
const { NFTItem } = require("./item.js");

const { MAX_NFT_HASH_LENGTH } = require("../../mitum.config.js");

const {
	HINT_MINT_ITEM,
	HINT_MINT_OPERATION,
	HINT_MINT_OPERATION_FACT,
} = require("../../alias/nft.js");
const { HINT_MINT_FORM } = require("../../alias/nft.js");

const { EC_INVALID_ITEM, EC_INVALID_MINT_FORM, EC_INVALID_NFT_HASH } = require("../../base/error.js");

const { NFTURI } = require("./collection-policy.js");
const { NFTSigners } = require("./nft-sign.js");

class NFTHash extends IBytes {
	constructor(s) {
		super();
		
		assert(typeof s === "string", error.type(EC_INVALID_NFT_HASH, "not string"));
		assert(s.length <= MAX_NFT_HASH_LENGTH, error.range(EC_INVALID_NFT_HASH, "nft hash length out of range"));
		
		this.s = s;
	}

	bytes() {
		return Buffer.from(this.s);
	}

	toString() {
		return this.s;
	}
}

// class MintForm extends IBytesDict {
// 	constructor(hash, uri, creators, copyrighters) {
// 		super();

// 		this.hint = new Hint(HINT_MINT_FORM);
// 		this.hash = new NFTHash(hash);
// 		this.uri = new NFTURI(uri);
		
// 		assert(creators instanceof NFTSigners, error.instance(EC_INVALID_MINT_FORM, "not NFTSigners intance"));
// 		assert(copyrighters instanceof NFTSigners, error.instance(EC_INVALID_MINT_FORM, "not NFTSigners instance"));
	
// 		this.creators = creators;
// 		this.copyrighters = copyrighters;
// 	}

// 	bytes() {
// 		return Buffer.concat([
// 			this.hash.bytes(),
// 			this.uri.bytes(),
// 			this.creators.bytes(),
// 			this.copyrighters.bytes(),
// 		]);
// 	}

// 	dict() {
// 		return {
// 			_hint: this.hint.toString(),
// 			hash: this.hash.toString(),
// 			uri: this.uri.toString(),
// 			creators: this.creators.dict(),
// 			copyrighters: this.copyrighters.dict(),
// 		}
// 	}
// }

class MintItem extends NFTItem {
	constructor(contract, collection, hash, uri, creators, currency) {
		super(HINT_MINT_ITEM, contract, collection, currency);
		
		this.hash = new NFTHash(hash);
		this.uri = new NFTURI(uri);
		assert(creators instanceof NFTSigners, error.instance(EC_INVALID_MINT_FORM, "not NFTSigners intance"));
		this.creators = creators;
	}

	bytes() {
		return Buffer.concat([
			super.bytes(),
			this.hash.bytes(),
			this.uri.bytes(),
			this.creators.bytes(),
			this.currency.bytes(),
		]);
	}

	dict() {
		return {
			_hint: this.hint.toString(),
			contract: this.contract.toString(),
			collection: this.collection.toString(),
			hash: this.hash.toString(),
			uri: this.uri.toString(),
			creators: this.creators.dict(),
			currency: this.currency.toString(),
		};
	}
	toString() {
		return this.collection.toString();
	}
}

class MintFact extends OperationFact {
	constructor(token, sender, items) {
		super(HINT_MINT_OPERATION_FACT, token, sender, items);

		items.forEach((item) =>
			assert(
				item instanceof MintItem,
				error.instance(EC_INVALID_ITEM, `not MintItem instance`)
			)
		);
	}

	get opHint() {
		return HINT_MINT_OPERATION;
	}
}

module.exports = {
	NFTHash,
	MintItem,
	MintFact
};