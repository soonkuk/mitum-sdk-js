import { useV, useId } from "./utils/config.js";
import { TimeStamp } from "./utils/time.js";

import { ecdsa } from "./key/ecdsa-keypair.js";
import { schnorr } from "./key/schnorr-keypair.js";
import { PublicKey, Keys } from "./key/key.js";
import { schnorrRandomN, ecdsaRandomN } from "./key/address.js";

import { Amount } from "./operations/currency/amount.js";
import {
	CreateAccountsItem,
	CreateAccountsFact,
	CreateAccountsOperation,
} from "./operations/currency/create-accounts.js";

import {
	KeyUpdaterFact,
	KeyUpdaterOperation,
} from "./operations/currency/key-updater.js";

import {
	TransfersItem,
	TransfersFact,
	TransfersOperation,
} from "./operations/currency/transfers.js";

import {
	CurrencyDesign,
	CurrencyPolicy,
	NilFeeer,
	FixedFeeer,
	RatioFeeer,
} from "./operations/currency/currency-design.js";

import {
	CurrencyRegisterFact,
	CurrencyRegisterOperation,
} from "./operations/currency/currency-register.js";

import {
	CurrencyPolicyUpdaterFact,
	CurrencyPolicyUpdaterOperation,
} from "./operations/currency/currency-policy-updater.js";

import {
	SuffrageInflationItem,
	SuffrageInflationFact,
	SuffrageInflationOperation,
} from "./operations/currency/suffrage-inflation.js";

import {
	CreateContractAccountsItem,
	CreateContractAccountsFact,
	CreateContractAccountsOperation,
} from "./operations/currency/create-contract-accounts.js";

import {
	WithdrawsItem,
	WithdrawsFact,
	WithdrawsOperation,
} from "./operations/currency/withdraws.js";

const KPGen = {
	schnorr: {
		...schnorr,
		randomN: schnorrRandomN,
	},
	...ecdsa,
	randomN: ecdsaRandomN,
};

const PubKey = PublicKey;

const Currency = {
	CreateAccountsItem,
	CreateAccountsFact,
	CreateAccountsOperation,
	KeyUpdaterFact,
	KeyUpdaterOperation,
	TransfersItem,
	TransfersFact,
	TransfersOperation,
	CurrencyDesign,
	CurrencyPolicy,
	NilFeeer,
	FixedFeeer,
	RatioFeeer,
	CurrencyRegisterFact,
	CurrencyRegisterOperation,
	CurrencyPolicyUpdaterFact,
	CurrencyPolicyUpdaterOperation,
	SuffrageInflationItem,
	SuffrageInflationFact,
	SuffrageInflationOperation,
	CreateContractAccountsItem,
	CreateContractAccountsFact,
	CreateContractAccountsOperation,
	WithdrawsItem,
	WithdrawsFact,
	WithdrawsOperation,
};

export { useV, useId, TimeStamp, KPGen, PubKey, Keys, Amount, Currency };
