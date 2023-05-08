const { GENESIS_DATA, MINE_RATE} = require('./config');
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
        let { difficulty } = lastBlock;
        let nonce = 0;

        // adjust value of nonce according to the difficulty and update the timestamp and hash according to it.
        do {
            nonce++;
            timestamp = Date.now();
            // dynamically create difficulty relevent to the current timestamp as well as the lastblock
            difficulty = Block.adjustDifficulty({originalBlock: lastBlock, timestamp});
            hash = cryptoHash(timestamp, lastHash, data, nonce, difficulty);
        } while (hash.substring(0, difficulty) !== '0'.repeat(difficulty));

        return new Block({ timestamp, lastHash, data, difficulty, nonce, hash });
    }

    // Dynamic difficulty 
    static adjustDifficulty({ originalBlock, timestamp}) {
        const { difficulty } = originalBlock;

        if(difficulty < 1) return 1;

        // if time is greater than mine rate reduce the difficulty
        if((timestamp - originalBlock.timestamp) > MINE_RATE) {
            return difficulty - 1;
        }
        // else increase the difficulty
        return difficulty + 1;
    }
}

module.exports = Block;