const { Address } = require("../../key/address.js");
const { ContractID, CurrencyID } = require("../../base/ID.js");
const { Item } = require("../item.js");

class NFTItem extends Item {
	constructor(hint, contract, collection, currency) {
		super(hint);
		
		this.contract = new Address(contract);
		this.collection = new ContractID(collection);
		this.currency = new CurrencyID(currency);
	}

	bytes() {
		return Buffer.concat([
			this.contract.bytes(),
			this.collection.bytes(),	
		]);
	}

	dict() {
		return {
			_hint: this.hint.toString(),
			contract: this.contract.toString(),
			collection: this.collection.toString(),
			currency: this.currency.toString(),
		}
	}
}

module.exports = {
	NFTItem,
};