const { Address } = require("../../key/address.js");
const { Big } = require("../../utils/number.js");
const { Hint } = require("../../base/hint.js");
const { OperationFact } = require("../fact.js");
const { error, assert } = require("../../base/error.js");
const { IBytesDict } = require("../../base/interface.js");

const { NFTItem } = require("./item.js");

const { MAX_NFT_SIGNER_SHARE, MAX_NFT_SIGNERS_TOTAL } = require("../../mitum.config.js");
const { sortBuf } = require("../../utils/string.js");

const {
	HINT_NFT_SIGN_ITEM,
	HINT_NFT_SIGN_OPERATION,
	HINT_NFT_SIGN_OPERATION_FACT,
} = require("../../alias/nft.js");
const { HINT_NFT_SIGNER, HINT_NFT_SIGNERS } = require("../../alias/nft.js");

const { NFTID } = require("../../base/nft-id.js");
const { EC_INVALID_ITEM, EC_INVALID_ITEMS, EC_INVALID_NFT_SIGNER, EC_INVALID_NFT_SIGNERS } = require("../../base/error.js");

class NFTSigner extends IBytesDict {
	constructor(account, share) {
		super();
		this.hint = new Hint(HINT_NFT_SIGNER);
		this.account = new Address(account);
		this.share = new Big(share);

		assert(this.share.v <= MAX_NFT_SIGNER_SHARE, error.range(EC_INVALID_NFT_SIGNER, "nft signer share out of range"));

		this.signed = false;
	}

	bytes() {
		return Buffer.concat([
			this.account.bytes(),
			this.share.fillBytes(),
			this.signed ? Buffer.from([1]) : Buffer.from([0]),
		]);
	}

	dict() {
		return {
			_hint: this.hint.toString(),
			account: this.account.toString(),
			share: this.share.v,
			signed: this.signed,
		};
	}
}

class NFTSigners extends IBytesDict {
	constructor(total, signers) {
		super();
		this.hint = new Hint(HINT_NFT_SIGNERS);
		this.total = new Big(total);

		assert(this.total.v <= MAX_NFT_SIGNERS_TOTAL, error.range(EC_INVALID_NFT_SIGNERS, "nft signers total out of range"));

		assert(Array.isArray(signers), error.type("not Array"));
		const sgset = new Set(signers.map(s => {
			assert(s instanceof NFTSigner, error.instance(EC_INVALID_NFT_SIGNERS, "not nft-signer instance"));
			return s.account.toString();
		}));
		assert(sgset.size === signers.length, error.duplicate(EC_INVALID_NFT_SIGNERS, "duplicate signer found"));

		const sum = signers.reduce((prev, s) => prev + s.share.v, 0);
		assert(sum === this.total.v, error.runtime(EC_INVALID_NFT_SIGNERS, "total != sum(share)"));

		this.signers = signers;
	}

	bytes() {
		return Buffer.concat([
			this.total.fillBytes(),
			Buffer.concat(this.signers.sort(sortBuf).map((s) => s.bytes())),
		]);
	}

	dict() {
		return {
			_hint: this.hint.toString(),
			total: this.total.v,
			signers: this.signers.sort(sortBuf).map((s) => s.dict()),
		}
	}
}

class NFTSignItem extends NFTItem {
	constructor(contract, collection, nft, currency) {
		super(HINT_NFT_SIGN_ITEM, contract, collection, currency);
		this.nft = new Big(nft);
	}

	bytes() {
		return Buffer.concat([
			super.bytes(),
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
			nft: this.nft.v,
		};
	}

	toString() {
		return this.nft.toString();
	}
}

class NFTSignFact extends OperationFact {
	constructor(token, sender, items) {
		super(HINT_NFT_SIGN_OPERATION_FACT, token, sender, items);

		items.forEach((item) => {
			assert(
				item instanceof NFTSignItem,
				error.instance(EC_INVALID_ITEM, `not NFTSignItem instance`)
			);

			assert(item.contract.toString() !== sender, error.runtime(EC_INVALID_ITEM, "contract == sender"));
		});

		const iset = new Set(items.map(item => item.toString()));
		assert(iset.size === items.length, error.duplicate(EC_INVALID_ITEMS, "duplicate nft found"));
	}

	get opHint() {
		return HINT_NFT_SIGN_OPERATION;
	}
}

module.exports = {
	NFTSigner,
	NFTSigners,
	NFTSignItem,
	NFTSignFact
};