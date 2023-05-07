const { GENESIS_DATA} = require('./config');
const cryptoHash = require('./crypto-hash');

class Block{
    constructor({timestamp, lastHash, data, hash, nonce, difficulty}){
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.data = data;
        this.hash = hash;
        this.nonce = nonce;
        // defines how many leading zeros should the hash have
        this.difficulty = difficulty;
    }

    // genesis block 
    static genesis() {
        return new Block(GENESIS_DATA);
    }

    // mine block
    static mineBlock({ lastBlock, data }) {
        let hash, timestamp;
        const lastHash = lastBlock.hash;
        // get the difficulty from the last block 
        const { difficulty } = lastBlock;
        let nonce = 0;

        // adjust value of nonce according to the difficulty and update the timestamp and hash according to it.
        do {
            nonce++;
            timestamp = Date.now();
            hash = cryptoHash(timestamp, lastHash, data, nonce, difficulty);
        } while (hash.substring(0, difficulty) !== '0'.repeat(difficulty));

        return new Block({ timestamp, lastHash, data, difficulty, nonce, hash });
    }
}

module.exports = Block;