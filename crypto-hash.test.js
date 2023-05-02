const cryptoHash = require('./crypto-hash');

describe('cryptoHash()', () => {
    
    it('generates a SHA-256 hashed output', () => {
        expect(cryptoHash('cs152')).toEqual('f04df1085aca45d59b8b0f772d1ce3cd5e62f1ba7fa5d2353e363d9ef192a29e')
    });

    it('produces same hash with the same input arguments in any order', () => {
        expect(cryptoHash('one', 'two', 'three')).toEqual(cryptoHash('three', 'one', 'two'));
    });
});