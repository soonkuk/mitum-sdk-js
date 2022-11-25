import { useV, useId, forceExtendedMessage } from "./utils/config.js";
import { TimeStamp } from "./utils/time.js";
import { sha256, sum256 } from "./utils/hash.js";
import { Big, Float } from "./utils/number.js";
import { sortStringAsBuf, sortBuf } from "./utils/string.js";

import {
	SUFFIX_KEY_PRIVATE,
	SUFFIX_KEY_PUBLIC,
	SUFFIX_ACCOUNT_ADDRESS,
} from "./alias/key.js";

import { ID, CurrencyID, ContractID } from "./base/ID.js";
import { error, assert } from "./base/error.js";
import { Hint } from "./base/hint.js";
import { IBytes, IDict, IBytesDict } from "./base/interface.js";
import { Token } from "./base/token.js";

import { ecdsa } from "./key/ecdsa-keypair.js";
import { schnorr } from "./key/schnorr-keypair.js";
import { PublicKey, Keys } from "./key/key.js";
import { Address, schnorrRandomN, ecdsaRandomN } from "./key/address.js";

import { Fact } from "./operations/fact.js";
import { Item } from "./operations/item.js";
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
};

const alias = {
	key: {
		SUFFIX_KEY_PRIVATE,
		SUFFIX_KEY_PUBLIC,
		SUFFIX_ACCOUNT_ADDRESS,
	},
};

const err = {
	...error,
	assert,
};

const base = {
	IBytes,
	IDict,
	IBytesDict,
};

const util = {
	sha256,
	sum256,
	sortStringAsBuf,
	sortBuf,
};

export {
	useV,
	useId,
	forceExtendedMessage,
	alias,
	err,
	base,
	util,
	TimeStamp,
	KPGen,
	PubKey,
	Keys,
	Amount,
	Token,
	Address,
	Hint,
	Fact,
	Item,
	ID,
	Big,
	Float,
	CurrencyID,
	ContractID,
	Operation,
	Currency,
};
