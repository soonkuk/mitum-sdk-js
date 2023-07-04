const bs58 = require("bs58");

const { Address } = require("../../key/address.js");
const { ContractID, CurrencyID } = require("../../base/ID.js");
const { Fact } = require("../fact.js");
const { Hint } = require("../../base/hint.js");
const { IBytesDict } = require("../../base/interface.js");
const { assert, error, EC_INVALID_COLLECTION_POLICY, EC_INVALID_COLLECTION_REGISTER_FORM } = require("../../base/error.js");

const {
	HINT_COLLECTION_REGISTER_OPERATION,
	HINT_COLLECTION_REGISTER_OPERATION_FACT,
} = require("../../alias/nft.js");

const { CollectionName, PaymentParam, NFTURI } = require("./collection-policy.js");
const { MAX_WHITELIST_IN_COLLECTION } = require("../../mitum.config.js");
const { sortBuf } = require("../../utils/string.js");

class CollectionRegisterFact extends Fact {
	constructor(token, sender, contract, collection, name, royalty, uri, whites, currency) {
		super(HINT_COLLECTION_REGISTER_OPERATION_FACT, token);

		this.sender = new Address(sender);
		this.contract = new Address(contract);
		this.collection = new ContractID(collection);
		this.name = new CollectionName(name);
		this.royalty = new PaymentParam(royalty);
		this.uri = new NFTURI(uri);
		this.currency = new CurrencyID(currency);
		assert(Array.isArray(whites), error.type(EC_INVALID_COLLECTION_POLICY, "not Array"));
		assert(whites.length <= MAX_WHITELIST_IN_COLLECTION, error.range(EC_INVALID_COLLECTION_REGISTER_FORM, "whitelist length out of range"));

		this.whites = whites.map(w => {
			assert(typeof w === "string" || w instanceof Address, error.type(EC_INVALID_COLLECTION_REGISTER_FORM, "wrong white account type found"));
			return typeof w === "string" ? new Address(w) : w;
		});

		const wset = new Set(this.whites);
		assert(wset.size === whites.length, error.duplicate(EC_INVALID_COLLECTION_REGISTER_FORM, "duplicate white account found"));

		this.hash = this.hashing();
	}

	bytes() {
		return Buffer.concat([
			this.token.bytes(),
			this.sender.bytes(),
			this.contract.bytes(),
			this.collection.bytes(),
			this.name.bytes(),
			this.royalty.bytes(),
			this.uri.bytes(),
			this.currency.bytes(),
			Buffer.concat(this.whites.sort(sortBuf).map((w) => w.bytes())),
		]);
	}

	dict() {
		return {
			_hint: this.hint.toString(),
			hash: bs58.encode(this.hash),
			token: this.token.toString(),
			sender: this.sender.toString(),
			contract: this.contract.toString(),
			collection: this.collection.toString(),
			name: this.name.toString(),
			royalty: this.royalty.v,
			uri: this.uri.toString(),
			whites: this.whites.sort(sortBuf).map((w) => w.toString()),
			currency: this.currency.toString(),
		}
	}

	get opHint() {
		return HINT_COLLECTION_REGISTER_OPERATION;
	}
}


module.exports = {
    CollectionRegisterFact,
};