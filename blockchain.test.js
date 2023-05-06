const Blockchain = require('./blockchain');
const Block = require('./block');
const { GENESIS_DATA } = require('./config');

describe('Blockchain', () => {
    const blockchain = new Blockchain();

    it('contains a `chain` Array instance', () => {
        expect(blockchain.chain instanceof Array).toBe(true);
    });

    it('starts with the genesis block', () =>{
        expect(blockchain.chain[0]).toEqual(Block.genesis());
    });

    it('adds new block to the chain', () => {
        const newData = 'test_data';
        blockchain.addBlock({ data: newData });

        expect(blockchain.chain[blockchain.chain.length-1].data).toEqual(newData);
    });
})