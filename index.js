import { random, fromPrivateKey, fromSeed } from "./key/keypair.js";
import { PublicKey, Keys } from "./key/key.js";
import { randomN } from "./key/address.js";

export const KPGen = {
	random,
	randomN,
	fromPrivateKey,
	fromSeed,
};

export const MPubKey = PublicKey;
export const MKeys = Keys;
