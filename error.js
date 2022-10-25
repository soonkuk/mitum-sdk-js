export const EC_INVALID_KEY = "EC_INVALID_KEY";
export const EC_INVALID_PRIVATE_KEY = "EC_INVALID_PRIVATE_KEY";
export const EC_INVALID_PUBLIC_KEY = "EC_INVALID_PUBLIC_KEY";
export const EC_INVALID_KEY_PAIR = "EC_INVALID_KEY_PAIR";
export const EC_INVALID_SEED = "EC_INVALID_SEED";

export const EC_NOT_IMPLEMENTED_BYTES = "EC_NOT_IMPLEMENTED_BYTES";
export const EC_NOT_IMPLEMENTED_DICT = "EC_NOT_IMPLEMENTED_DICT";

class CustomError extends Error {
	constructor(msg) {
		super(msg);
		this.name = this.constructor.name;
	}
}

export class SuffixError extends CustomError {
	constructor(msg, code, meta) {
		super(msg);
		this.code = code || "";
		this.metadata = meta || "";
	}
}

export class InvalidFormatError extends CustomError {
	constructor(msg, code, meta) {
		super(msg);
		this.code = code || "";
		this.metadata = meta || "";
	}
}

export class InvalidLengthError extends CustomError {
	constructor(msg, code, meta) {
		super(msg);
		this.code = code || "";
		this.metadata = meta || "";
	}
}

export class InvalidTypeError extends CustomError {
	constructor(msg, code, meta) {
		super(msg);
		this.code = code || "";
		this.metadata = meta || "";
	}
}

export class NotImplementedError extends CustomError {
	constructor(msg, code, meta) {
		super(msg);
		this.code = code || "";
		this.metadata = meta || "";
	}
}

export class InvalidInstanceError extends CustomError {
	constructor(msg, code, meta) {
		super(msg);
		this.code = code || "";
		this.metadata = meta || "";
	}
}
