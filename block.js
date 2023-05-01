const { GENESIS_DATA} = require('./config');

class Block{
    constructor({timestamp, lastHash, data, hash}){
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.data = data;
        this.hash = hash;
    }

    // genesis block 
    static genesis() {
        return new Block(GENESIS_DATA);
    }

    // mine block
    static mineBlock({ lastBlock, data }) {
        return new Block({
            timestamp: Date.now(),
            lastHash: lastBlock.hash,
            data: data
        });
    }
}

module.exports = Block;