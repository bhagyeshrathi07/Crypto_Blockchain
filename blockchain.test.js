const Blockchain = require('./blockchain');
const Block = require('./block');
const { GENESIS_DATA } = require('./config');

describe('Blockchain', () => {
    let blockchain, newChain, originalChain;
    
    // intitialize new Blockchain instance before each test
    beforeEach(() => {
        blockchain = new Blockchain();
        newChain = new Blockchain();
        originalChain = blockchain.chain;
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

    // chain replacement
    describe('replaceChain()', () => {
        let errorMock, logMock;

        beforeEach(() => {
            errorMock = jest.fn();
            logMock = jest.fn();

            global.console.error = errorMock;
            global.console.log = logMock;
        });
        
        // when the chain is not longer
        describe('The new chain is not longer', () => {
            beforeEach(() => {
                newChain.chain[0] = {new: 'chain'};                
                // call the replaceChain function and check if the chain gets replaced
                blockchain.replaceChain(newChain.chain);
            });

            it('It does not replace the chain', () => {
                expect(blockchain.chain).toEqual(originalChain);
            });

            it('logs an error', () => {
                expect(errorMock).toHaveBeenCalled();
            })
        });

        // when the chain is longer
        describe('The new chain is longer', () => {
            beforeEach (() => {
                newChain.addBlock({data: 'Lions'});
                newChain.addBlock({data: 'Tigers'});
                newChain.addBlock({data: 'Elephants'});
            });
            describe('The chain is invalid', () => {
                beforeEach(() => {
                    newChain.chain[2].hash = 'fake-hash';
                    blockchain.replaceChain(newChain.chain);
                });
                it('It does not replace the chain', () => {
                    // since the hash of the block is invalid blockchain should not replace the chain
                    expect(blockchain.chain).toEqual(originalChain);
                });

                it('logs an error', () => {
                    expect(errorMock).toHaveBeenCalled();
                })
            });

            describe('The chain is valid', () => {
                beforeEach(() => {
                    blockchain.replaceChain(newChain.chain);
                });
                it('It replaces the chain', () => {
                    blockchain.replaceChain(newChain.chain);
                    
                    // chain should be replaced if the newchain is valid
                    expect(blockchain.chain).toEqual(newChain.chain);
                });

                it('logs about the chain replacement', () => {
                    expect(logMock).toHaveBeenCalled();
                }); 
            });

        });
    });
})