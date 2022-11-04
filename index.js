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
};

export { KPGen, PubKey, Keys, Amount, Currency };
