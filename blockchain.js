const Block = require('./block');
const cryptoHash = require('./crypto-hash');

class Blockchain {
    constructor() {
        this.chain = [Block.genesis()];
    }

    // add block to the chain using mineBlock method from Block class
    addBlock({data}) {
        const newBlock = Block.mineBlock({
            lastBlock: this.chain[this.chain.length-1],
            data
        });

        this.chain.push(newBlock)
    }

    // chain validation
    static isValidChain(chain) {
        
        // if the first block of the chain is not the genesis block return false
        if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
            return false;
        };

        for(let i = 1; i < chain.length; i++) {
            const {timestamp, lastHash, hash, data} = chain[i];

            // stores the hash of the last block 
            const actualLastHash = chain[i-1].hash;

            // if lastHash from the current block is not equal to the hash value of the last block return false
            if (lastHash !== actualLastHash) {
                return false;
            }

            // calculate the hash of the current block with appropriate data and hash function
            const validatedHash = cryptoHash(timestamp, lastHash, data);

            // if hash of the current block is not equal to the calcualted hash with appropriate data and function return false
            if(hash !== validatedHash) {
                return false;
            }
        }
        return true;
    }
}

module.exports = Blockchain;