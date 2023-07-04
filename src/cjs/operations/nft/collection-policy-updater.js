const bs58 = require("bs58");
const { Address } = require("../../key/address.js");
const { ContractID, CurrencyID } = require("../../base/ID.js");
const { Fact } = require("../fact.js");
const { assert, error } = require("../../base/error.js");

const {
	HINT_COLLECTION_POLICY_UPDATER_OPERATION,
	HINT_COLLECTION_POLICY_UPDATER_OPERATION_FACT,
} = require("../../alias/nft.js");

const { EC_INVALID_FACT, EC_INVALID_COLLECTION_POLICY } = require("../../base/error.js");
const { CollectionName, PaymentParam, NFTURI } = require("./collection-policy.js");
const { MAX_WHITELIST_IN_COLLECTION } = require("../../mitum.config.js");
const { sortBuf } = require("../../utils/string.js");

class CollectionPolicyUpdaterFact extends Fact {
	constructor(token, sender, contract, collection, name, royalty, uri, whites, currency) {
		super(HINT_COLLECTION_POLICY_UPDATER_OPERATION_FACT, token);
		
		assert(contract !== sender, error.runtime(EC_INVALID_FACT, "contract == sender"));
		this.sender = new Address(sender);
		this.contract = new Address(contract);
		this.name = new CollectionName(name);
        this.royalty = new PaymentParam(royalty);
        this.uri = new NFTURI(uri);
		this.collection = new ContractID(collection);
		
		assert(Array.isArray(whites), error.type(EC_INVALID_COLLECTION_POLICY, "not Array"));
        assert(whites.length <= MAX_WHITELIST_IN_COLLECTION, error.range(EC_INVALID_COLLECTION_POLICY, "whitelist length out of range"));

        this.whites = whites.map(w => {
            assert(typeof w === "string" || w instanceof Address, error.type(EC_INVALID_COLLECTION_POLICY, "wrong white account type found"));
            return typeof w === "string" ? new Address(w) : w;
        });

        const wset = new Set(this.whites);
        assert(wset.size === whites.length, error.duplicate(EC_INVALID_COLLECTION_POLICY, "duplicate white account found"));

		this.currency = new CurrencyID(currency);
		this.hash = this.hashing();
	}

	bytes() {
		// let result = []
		// for (let b of buf) {
		//   result.push(b.toString(2).padStart(8, '0'))
		// }
		// console.log(result.join(''))

		// let whitelist = this.whites.sort(sortBuf).map((w) => w)
		// console.log(whitelist)

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
		return HINT_COLLECTION_POLICY_UPDATER_OPERATION;
	}
}

module.exports = {
	CollectionPolicyUpdaterFact,
};