const Block = require("./Block");
const cryptoHash = require("./cryptoHash");

class BlockChain {
  constructor() {
    this.chain = [Block.genesis()];
  }

  addBlock({ data }) {
    const newBlock = Block.mine({
      lastBlock: this.chain[this.chain.length - 1],
      data,
    });
    this.chain.push(newBlock);
  }

  static isValidChain(chain) {
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis()))
      return false;

    for (let i = 1; i < chain.length; i++) {
      const block = chain[i];

      const { timestamp, previousHash, hash, data, nonce, difficulty } = block;
      const actualLastHash = chain[i - 1].hash;
      const lastDifficulty = chain[i - 1].difficulty;

      if (previousHash !== actualLastHash) return false;

      const validatedHash = cryptoHash(
        timestamp,
        previousHash,
        data,
        nonce,
        difficulty
      );

      if (hash !== validatedHash) return false;

      if (Math.abs(lastDifficulty - difficulty) > 1) return false;
    }

    return true;
  }

  replaceChain(chain) {
    if (chain.length <= this.chain.length) {
      console.error("The incoming chain must be longer");
      return;
    }

    if (!BlockChain.isValidChain(chain)) {
      console.error("Chain should be valid");
      return;
    }

    console.log("🔃 replacing chain with", chain);
    this.chain = chain;
  }
}

module.exports = BlockChain;
