import {
	assert,
	error,
	EC_INVALID_NETWORK_ID,
	EC_INVALID_VERSION,
	EC_INVALID_SIG_TYPE,
} from "../base/error.js";

let version = "v0.0.1";
export const v = () => {
	return version;
};
export const useV = (s) => {
	assert(typeof s === "string", error.type(EC_INVALID_VERSION, "not string"));
	version = s;
	return version;
};

let networkId = "mitum";
export const id = () => {
	return networkId;
};
export const useId = (s) => {
	assert(
		typeof s === "string",
		error.type(EC_INVALID_NETWORK_ID, "not string")
	);
	networkId = s;
	return networkId;
};

export const SIG_TYPE = {
	DEFAULT: "sig-type/mitum1",
	M1: "sig-type/mitum1",
	M2: "sig-type/mitum2",
	M2_NODE: "sig-type/mitum2/node",
};

let signatureType = SIG_TYPE.DEFAULT;
export const sigType = () => {
	return signatureType;
};
export const useSigType = (s) => {
	assert(
		typeof s === "string",
		error.type(EC_INVALID_SIG_TYPE, "not string")
	);

	const { DEFAULT, M2, M2_NODE } = SIG_TYPE;
	assert(
		[DEFAULT, M2, M2_NODE].includes(s),
		error.format(EC_INVALID_SIG_TYPE, "invalid sig-type")
	);

	signatureType = s;
	return signatureType;
};
