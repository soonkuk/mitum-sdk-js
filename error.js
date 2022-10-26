export const EC_INVALID_KEY = "EC_INVALID_KEY";
export const EC_INVALID_PRIVATE_KEY = "EC_INVALID_PRIVATE_KEY";
export const EC_INVALID_PUBLIC_KEY = "EC_INVALID_PUBLIC_KEY";
export const EC_INVALID_KEY_PAIR = "EC_INVALID_KEY_PAIR";
export const EC_INVALID_SEED = "EC_INVALID_SEED";

export const EC_INVALID_KEYS = "EC_INVALID_KEYS";
export const EC_INVALID_WEIGHT = "EC_INVALID_WEIGHT";
export const EC_INVALID_THRESHOLD = "EC_INVALID_THRESHOLD";
export const EC_INVALID_ADDRESS = "EC_INVALID_ADDRESS";

export const EC_INVALID_BIG_INTEGER = "EC_INVALID_BIG_INTERGER";

export const EC_NOT_IMPLEMENTED_BYTES = "EC_NOT_IMPLEMENTED_BYTES";
export const EC_NOT_IMPLEMENTED_DICT = "EC_NOT_IMPLEMENTED_DICT";

class CustomError extends Error {
	constructor(msg, code, meta) {
		super(msg);
		this.code = code || "";
		this.metadata = meta || "";
		this.name = this.constructor.name;
	}
}

export class SuffixError extends CustomError {
	constructor(msg, code, meta) {
		super(msg, code, meta);
	}
}

export class InvalidFormatError extends CustomError {
	constructor(msg, code, meta) {
		super(msg, code, meta);
	}
}

export class InvalidLengthError extends CustomError {
	constructor(msg, code, meta) {
		super(msg, code, meta);
	}
}

export class InvalidRangeError extends CustomError {
	constructor(msg, code, meta) {
		super(msg, code, meta);
	}
}

export class InvalidTypeError extends CustomError {
	constructor(msg, code, meta) {
		super(msg, code, meta);
	}
}

export class InvalidInstanceError extends CustomError {
	constructor(msg, code, meta) {
		super(msg, code, meta);
	}
}

export class NotImplementedError extends CustomError {
	constructor(msg, code, meta) {
		super(msg, code, meta);
	}
}
