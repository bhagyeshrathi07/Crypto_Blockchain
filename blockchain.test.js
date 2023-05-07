const Blockchain = require('./blockchain');
const Block = require('./block');
const { GENESIS_DATA } = require('./config');

describe('Blockchain', () => {
    let blockchain;

    // intitialize new Blockchain instance before each test
    beforeEach(() => {
        blockchain = new Blockchain();
    });

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

    // chain validation
    describe('isValidChain()', () => {
        describe('The chain does not start with the genesis block', () => {
            it('returns false', () => {
                blockchain.chain[0] = { data: 'fake-genesis'};
  
                expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
            });
        });

        describe('The chain starts with genesis block and also has multiple blocks', () => {
            beforeEach(() => {
                blockchain.addBlock({data: 'Lions'});
                blockchain.addBlock({data: 'Tigers'});
                blockchain.addBlock({data: 'Elephants'});
            });
            describe('lastHash reference has changed', () => {
                it('returns false', () => {
                    
                    blockchain.chain[2].lastHash = 'broken-lastHash';
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
                });
            });

            describe('The chain contains a block with invalid field', () => {
                it('returns false', () => {

                    blockchain.chain[2].data = 'bad-data';
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
                });
            });

            describe('The chain does not contain any invalid blocks', () => {
                it('returns true', () => {
                    blockchain.addBlock({data: 'Lions'});
                    blockchain.addBlock({data: 'Tigers'});
                    blockchain.addBlock({data: 'Elephants'});

                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(true);
                });
            });
        })
    });
})