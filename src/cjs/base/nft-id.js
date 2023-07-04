const { IBytesDict } = require("./interface");
const { Big } = require("../utils/number.js")
const { ContractID } = require("./ID.js")
const { Hint } = require("./hint.js")


const { HINT_NFT_ID } = require("../alias/nft.js");
const { MAX_COLLECTION_INDEX } = require("../mitum.config.js");

const { EC_INVALID_NFT_ID } = require("./error.js");
const { error, assert } = require("./error.js");

class NFTID extends IBytesDict {
    constructor(collection, index) {
        super();
        this.hint = new Hint(HINT_NFT_ID);
        this.collection = new ContractID(collection);
        this.index = new Big(index);

        assert(
            0 < this.index.v && this.index.v <= MAX_COLLECTION_INDEX,
            error.range(EC_INVALID_NFT_ID, "collection index out of range")
        );
    }

    bytes() {
        return Buffer.concat([
            this.collection.bytes(),
            this.index.fillBytes(),
        ]);
    }

    dict() {
        return {
            _hint: this.hint.toString(),
            collection: this.collection.toString(),
            index: this.index.v,
        }
    }

    toString() {
        const s = this.index.toString();
        const max = "" + MAX_COLLECTION_INDEX
        return `${this.collection.toString()}-${("0" * (max.length - s.length))+ s}`;
    }
}

module.exports ={
    NFTID
}