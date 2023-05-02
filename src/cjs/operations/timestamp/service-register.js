const HINT_TIMESTAMP_SERVICE_REGISTER_OPERATION = "mitum-timestamp-service-register-operation";
const HINT_TIEMSTAMP_SERVICE_REGISTER_OPERATION_FACT = "mitum-timestamp-service-register-operation-fact";

const bs58 = require("bs58");

const { Fact } = require("../fact.js");

const { ContractID, CurrencyID } = require("../../base/ID.js");
const { Address } = require("../../key/address.js");

exports.ServiceRegisterFact = class ServiceRegisterFact extends Fact {
	constructor(token, sender, target, service, currency) {
		super(HINT_TIEMSTAMP_SERVICE_REGISTER_OPERATION_FACT, token, sender, target, service, currency);
		this.sender = new Address(sender);
		this.target = new Address(target);
		this.service = new ContractID(service)
		this.currency = new CurrencyID(currency)
		this.hash = this.hashing();
	}

	bytes() {
		return Buffer.concat([
			this.token.bytes(),
			this.sender.bytes(),
			this.target.bytes(),
			this.service.bytes(),
			this.currency.bytes()
		]);
	}

	dict() {
		return {
			_hint: this.hint.toString(),
			hash: bs58.encode(this.hash),
			token: this.token.toString(),
			sender: this.sender.toString(),
			target: this.target.toString(),
			service: this.service.toString(),
			currency: this.currency.toString()
		};
	}

	get opHint() {
		return HINT_TIMESTAMP_SERVICE_REGISTER_OPERATION;
	}
};
