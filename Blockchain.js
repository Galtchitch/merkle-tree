/**
 * Seminar 2.1 Blockchain primitive
 */

const SHA256 = require('ethereum-cryptography/sha256').sha256;
const utf8ToBytes = require('ethereum-cryptography/utils').utf8ToBytes;
const { toHex } = require('ethereum-cryptography/utils');

class Block {
    constructor(data) {
        this.data = data;
        this.previousHash = null;
    }

    toHash() {
        // Convert both data and previousHash to strings before concatenation
        const dataString = typeof this.data === 'string' ? this.data : JSON.stringify(this.data);
        const prevHashString = this.previousHash ? toHex(this.previousHash) : '';
        const hashBytes = utf8ToBytes(dataString + prevHashString);
        return SHA256(hashBytes);
    }
}

class Blockchain {
    constructor() {
        this.chain = [
            new Block("Genesis Block") // Genesis block
        ];
    }

    addBlock(block) {
        block.previousHash = this.chain[this.chain.length - 1].toHash();
        this.chain.push(block);
    }

    isValid() {
        // Special case: only genesis block is always valid
        if (this.chain.length === 1) return true;

        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            // Compare hex representations of hashes
            const currentPrevHash = toHex(currentBlock.previousHash);
            const actualPrevHash = toHex(previousBlock.toHash());

            if (currentPrevHash !== actualPrevHash) {
                return false;
            }
        }
        return true;
    }
}

module.exports = { Block, Blockchain };