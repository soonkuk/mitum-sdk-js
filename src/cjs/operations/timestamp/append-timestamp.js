const HINT_TIMESTAMP_APPEND_OPERATION = "mitum-timestamp-append-operation";
const HINT_TIMESTAMP_APPEND_OPERATION_FACT = "mitum-timestamp-append-operation-fact";

const bs58 = require("bs58");

const { Fact } = require("../fact.js");

const { ContractID, CurrencyID } = require("../../base/ID.js");
const { Address } = require("../../key/address.js");
const { Big } = require("../../utils/number.js");

exports.AppendTimeStampFact = class AppendTimeStampFact extends Fact {
	constructor(token, sender, target, service, project, requestTs, data, currency) {
		super(HINT_TIMESTAMP_APPEND_OPERATION_FACT, token);
		this.sender = new Address(sender);
		this.target = new Address(target);
		this.service = new ContractID(service)
		this.project = project
		this.requestTs = new Big(requestTs);
		this.data = data
		this.currency = new CurrencyID(currency)
		this.hash = this.hashing();
	}

	bytes() {
		return Buffer.concat([
			this.token.bytes(),
			this.sender.bytes(),
			this.target.bytes(),
			this.service.bytes(),
			Buffer.from(this.project),
			this.requestTs.fillBytes(),
			Buffer.from(this.data),
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
			projectid: this.project,
			request_timestamp: this.requestTs.v,
			data: this.data,
			currency: this.currency.toString()
		};
	}

	get opHint() {
		return HINT_TIMESTAMP_APPEND_OPERATION;
	}
};
