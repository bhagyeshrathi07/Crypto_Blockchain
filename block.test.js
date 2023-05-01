const Block = require('./block');
const { GENESIS_DATA } = require('./config');


describe('Block', () => {
    const timestamp = 'a-date';
    const lastHash = 'foo-hash';
    const hash = 'bar-hash';
    const data = ['Blockchain', 'data'];
    const block = new Block({ timestamp, lastHash, hash, data });

    // testing if block has all the properties
    it('has a timestamp, lastHash, hash, and data property', () => {
        expect(block.timestamp).toEqual(timestamp);
        expect(block.lastHash).toEqual(lastHash);
        expect(block.hash).toEqual(hash);
        expect(block.data).toEqual(data);
    });

    // tests for genesis block
    describe('genesis()', () => {
        const genesisBlock = Block.genesis();

        it('returns a Block instatnce', () => {
            expect(genesisBlock instanceof Block).toBe(true);
        });

        it('returns the genesis data', () => {
            expect(genesisBlock).toEqual(GENESIS_DATA);
        });
    });
});