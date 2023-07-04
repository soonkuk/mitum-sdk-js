exports.SUFFIX_LENGTH = 3;
exports.SUFFIX_ZERO_ADDRESS_LENGTH = 5;

exports.MIN_CURRENCY_ID_LENGTH = 3;
exports.MAX_CURRENCY_ID_LENGTH = 10;

exports.MIN_CONTRACT_ID_LENGTH = 3;
exports.MAX_CONTRACT_ID_LENGTH = 10;

exports.MIN_SEED_LENGTH = 36;

exports.MIN_THRESHOLD = 1;
exports.MAX_THRESHOLD = 100;

exports.MIN_WEIGHT = 1;
exports.MAX_WEIGHT = 100;

exports.MAX_KEYS_IN_ADDRESS = 10;
exports.MAX_AMOUNTS_IN_ITEM = 10;
exports.MAX_ITEMS_IN_FACT = 10;

exports.MAX_URI_LENGTH = 1000;
exports.MAX_NFT_HASH_LENGTH = 1024;

exports.MAX_COLLECTION_INDEX = 10000;
exports.MIN_COLLECTION_NAME_LENGTH = 3;
exports.MAX_COLLECTION_NAME_LENGTH = 30;
exports.MAX_WHITELIST_IN_COLLECTION = 10;
exports.MIN_PAYMENT_PARAM = 0;
exports.MAX_PAYMENT_PARAM = 99;

exports.MAX_NFT_SIGNER_SHARE = 100;
exports.MAX_NFT_SIGNERS_TOTAL = 100;

exports.MAX_OPERATIONS_IN_SEAL = 10;

exports.TEST_CURRENCY = {
	PEN: {
		currency: "PEN",
		zero: "PEN-Xmca",
	},
	MCC: {
		currency: "MCC",
		zero: "MCC-Xmca",
	},
};

exports.TEST_NODE = {
	m1: "KxaTHDAQnmFeWWik5MqWXBYkhvp5EpWbsZzXeHDdTDb5NE1dVw8wmpr",
	m2: "EYc4WdFjP9qkgfwJZfnsVXeh827rsNppm5HUSjSDeMFFmpr",
	m2ether: "f69f845b154048b5d1c4bff066cf286da6da2b127d9ac5004c2fb9a2d83f93d8epr",
};

exports.TEST_GENESIS = {
	m1: {
		address: "DBa8N5of7LZkx8ngH4mVbQmQ2NHDd6gL2mScGfhAEqddmca",
		private: "KzFERQKNQbPA8cdsX5tCiCZvR4KgBou41cgtPk69XueFbaEjrczbmpr",
	},
	m2: {
		address: "2E5qNuz9HsXydeTTdG1a3SZtj1iBWNUyVyfHYNcs4gSgmca",
		private: "D4QPRNSTgYmgRymYVS1mLgyGtCbzeAPYhd5r4jNQahwampr",
	},
	m2ether: {
		address: "cbc14fe342eea61d5922f83a5d3bfcb06d120df9eca",
		private: "7b7926dc931b88442a5b2e18cf1b149fb673907f072942240416afa773ca03a9epr",
	},
};

exports.TEST_ACCOUNT = {
	public: "2122tJTiK183VbZFsecRgvaybcqM1wwGRLrsru9e5FaJMmpu",
	address: "AN91jfkYtje64GPrKPkGMrrPnb7iq9TZq1fBHxwML9wmmca",
};

exports.TEST_ACCOUNT_R = {
	public: "u8Ey4xJwzEgPTc2kMPZtiiXBTsg5AKwt4vuWpM4RpsQtmpu",
	address: "5f2WQP8Ckn7mRHrv9mkqdvC7vEjB3w7kurbRWurgT62Wmca",
};

exports.TEST_ACCOUNT_ETHER = {
	public: "0477c8ea663217870e3a93a01ceb47ce0fcaef5e3f0459f161a7fc70be8b417846d7a01b24c0211e86f5d748ec346e9455f41037420f0038f5cf26eb6ec69bfc63epu",
	address: "fc44aa45090109854ffdcac424408271a57d631ceca"
};