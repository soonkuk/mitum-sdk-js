const { Address } = require("../../key/address.js");
const { Big } = require("../../utils/number.js");
const { Hint } = require("../../base/hint.js");
const { error, assert } = require("../../base/error.js");
const { sortBuf } = require("../../utils/string.js");
const { IBytes, IBytesDict } = require("../../base/interface.js");

const { MAX_COLLECTION_NAME_LENGTH, MAX_PAYMENT_PARAM, MAX_WHITELIST_IN_COLLECTION, MIN_COLLECTION_NAME_LENGTH, MIN_PAYMENT_PARAM, MAX_URI_LENGTH } = require("../../mitum.config.js");

const { HINT_COLLECTION_POLICY } = require("../../alias/nft.js");
const { EC_INVALID_COLLECTION_NAME, EC_INVALID_COLLECTION_POLICY, EC_INVALID_NFT_URI, EC_INVALID_PAYMENT_PARAM } = require("../../base/error.js");

class NFTURI extends IBytes {
    constructor(s) {
        super();
        assert(s.length <= MAX_URI_LENGTH, error.range(EC_INVALID_NFT_URI, "nft uri length out of range"));
        this.s = s;
    }

    bytes() {
        return Buffer.from(this.s);
    }

    toString() {
        return this.s;
    }
}

class PaymentParam extends IBytes {
    constructor(param) {
        super();
        this.param = new Big(param);

        assert(
            MIN_PAYMENT_PARAM < this.param.v && this.param.v < MAX_PAYMENT_PARAM,
            error.range(EC_INVALID_PAYMENT_PARAM, "payment parameter out of range"),
        );
    }

    bytes() {
        return this.param.fillBytes();
    }

    get v() {
        return this.param.v;
    }
}

class CollectionName extends IBytes {
    constructor(s) {
        super();

        assert(typeof s === "string", error.type(EC_INVALID_COLLECTION_NAME, "not string"));
        assert(
            s.length >= MIN_COLLECTION_NAME_LENGTH &&
            s.length <= MAX_COLLECTION_NAME_LENGTH,
            error.range(
                EC_INVALID_COLLECTION_NAME,
                "collection name length out of range"
            )
        );

        this.s = s;
    }

    equal(name) {
        if (!name) {
            return false;
        }

        if (!name instanceof CollectionName) {
            return false;
        }

        return this.toString() === name.toString();
    }

    bytes() {
        return Buffer.from(this.s);
    }

    toString() {
        return this.s;
    }
}

class CollectionPolicy extends IBytesDict {
    constructor(name, royalty, uri, whites) {
        super();

        this.hint = new Hint(HINT_COLLECTION_POLICY);
        this.name = new CollectionName(name);
        this.royalty = new PaymentParam(royalty);
        this.uri = new NFTURI(uri);

        assert(Array.isArray(whites), error.type(EC_INVALID_COLLECTION_POLICY, "not Array"));
        assert(whites.length <= MAX_WHITELIST_IN_COLLECTION, error.range(EC_INVALID_COLLECTION_POLICY, "whitelist length out of range"));

        this.whites = whites.map(w => {
            assert(typeof w === "string" || w instanceof Address, error.type(EC_INVALID_COLLECTION_POLICY, "wrong white account type found"));
            return typeof w === "string" ? new Address(w) : w;
        });

        const wset = new Set(this.whites);
        assert(wset.size === whites.length, error.duplicate(EC_INVALID_COLLECTION_POLICY, "duplicate white account found"));
    }

    bytes() {
        return Buffer.concat([
            this.name.bytes(),
            this.royalty.bytes(),
            this.uri.bytes(),
            Buffer.concat(this.whites.sort(sortBuf).map((w) => w.bytes())),
        ]);
    }

    dict() {
        return {
            _hint: this.hint.toString(),
            name: this.name.toString(),
            royalty: this.royalty.v,
            uri: this.uri.toString(),
            whites: this.whites.sort(sortBuf).map((w) => w.toString()),
        }
    }
}

module.exports = {
    NFTURI,
    PaymentParam,
    CollectionName,
    CollectionPolicy,
};