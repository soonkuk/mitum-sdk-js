import { useV, useId } from "./utils/config.js";
import { TimeStamp } from "./utils/time.js";

import { ecdsa } from "./key/ecdsa-keypair.js";
import { schnorr } from "./key/schnorr-keypair.js";
import { PublicKey, Keys } from "./key/key.js";
import { schnorrRandomN, ecdsaRandomN } from "./key/address.js";

import { Operation } from "./operations/operation.js";

import { Amount } from "./operations/currency/amount.js";
import {
	CreateAccountsItem,
	CreateAccountsFact,
} from "./operations/currency/create-accounts.js";

import { KeyUpdaterFact } from "./operations/currency/key-updater.js";

import {
	TransfersItem,
	TransfersFact,
} from "./operations/currency/transfers.js";

import {
	CurrencyDesign,
	CurrencyPolicy,
	NilFeeer,
	FixedFeeer,
	RatioFeeer,
} from "./operations/currency/currency-design.js";

import { CurrencyRegisterFact } from "./operations/currency/currency-register.js";

import { CurrencyPolicyUpdaterFact } from "./operations/currency/currency-policy-updater.js";

import {
	SuffrageInflationItem,
	SuffrageInflationFact,
} from "./operations/currency/suffrage-inflation.js";

import {
	CreateContractAccountsItem,
	CreateContractAccountsFact,
} from "./operations/currency/create-contract-accounts.js";

import {
	WithdrawsItem,
	WithdrawsFact,
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
	KeyUpdaterFact,
	TransfersItem,
	TransfersFact,
	CurrencyDesign,
	CurrencyPolicy,
	NilFeeer,
	FixedFeeer,
	RatioFeeer,
	CurrencyRegisterFact,
	CurrencyPolicyUpdaterFact,
	SuffrageInflationItem,
	SuffrageInflationFact,
	CreateContractAccountsItem,
	CreateContractAccountsFact,
	WithdrawsItem,
	WithdrawsFact,
	Operation,
};

export {
	useV,
	useId,
	TimeStamp,
	KPGen,
	PubKey,
	Keys,
	Amount,
	Operation,
	Currency,
};
