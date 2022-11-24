export const SUFFIX_LENGTH = 3;

export const MIN_CURRENCY_ID_LENGTH = 3;
export const MAX_CURRENCY_ID_LENGTH = 10;

export const MIN_CONTRACT_ID_LENGTH = 3;
export const MAX_CONTRACT_ID_LENGTH = 10;

export const MIN_SEED_LENGTH = 36;

export const MIN_THRESHOLD = 1;
export const MAX_THRESHOLD = 100;
export const MIN_WEIGHT = 1;
export const MAX_WEIGHT = 100;

export const MAX_KEYS_IN_ADDRESS = 10;
export const MAX_AMOUNTS_IN_ITEM = 10;
export const MAX_ITEMS_IN_FACT = 10;

export const TEST_NODE = {
	ecdsa: "KxaTHDAQnmFeWWik5MqWXBYkhvp5EpWbsZzXeHDdTDb5NE1dVw8wmpr",
	schnorr: "",
};

export const TEST_GENESIS = {
	ecdsa: {
		address: "DBa8N5of7LZkx8ngH4mVbQmQ2NHDd6gL2mScGfhAEqddmca",
		private: "KzFERQKNQbPA8cdsX5tCiCZvR4KgBou41cgtPk69XueFbaEjrczbmpr",
	},
	schnorr: {
		address: "2E5qNuz9HsXydeTTdG1a3SZtj1iBWNUyVyfHYNcs4gSgmca",
		private: "D4QPRNSTgYmgRymYVS1mLgyGtCbzeAPYhd5r4jNQahwampr",
	},
};

export const TEST_ACCOUNT = {
	public: "2122tJTiK183VbZFsecRgvaybcqM1wwGRLrsru9e5FaJMmpu",
	address: "AN91jfkYtje64GPrKPkGMrrPnb7iq9TZq1fBHxwML9wmmca",
};

export const TEST_ACCOUNT_R = {
	public: "u8Ey4xJwzEgPTc2kMPZtiiXBTsg5AKwt4vuWpM4RpsQtmpu",
	address: "5f2WQP8Ckn7mRHrv9mkqdvC7vEjB3w7kurbRWurgT62Wmca",
};
