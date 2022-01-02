const hexToBinary = require("hex-to-binary");

const { GENESIS_DATA, MINE_RATE } = require("../config");
const cryptoHash = require("../utils/cryptoHash");

class Block {
  constructor({ timestamp, previousHash, hash, data, nonce, difficulty }) {
    this.timestamp = timestamp;
    this.previousHash = previousHash;
    this.hash = hash;
    this.data = data;
    this.nonce = nonce;
    this.difficulty = difficulty;
  }

  static genesis() {
    return new this(GENESIS_DATA);
  }

  static mine({ lastBlock, data }) {
    let hash, timestamp;

    const previousHash = lastBlock.hash;
    let { difficulty } = lastBlock;
    let nonce = 0;

    do {
      nonce++;
      timestamp = Date.now();
      difficulty = Block.adjustDifficulty({
        originalBlock: lastBlock,
        timestamp,
      });

      hash = cryptoHash(timestamp, previousHash, data, nonce, difficulty);
      // } while (hash.substring(0, difficulty) !== "0".repeat(difficulty));  // hex way of proof of work
    } while (
      hexToBinary(hash).substring(0, difficulty) !== "0".repeat(difficulty)
    ); // binary way of proof of work

    return new this({
      timestamp,
      previousHash,
      hash,
      data,
      nonce,
      difficulty,
    });
  }

  static adjustDifficulty({ originalBlock, timestamp }) {
    const { difficulty } = originalBlock;

    if (difficulty < 1) return 1;

    const difference = timestamp - originalBlock.timestamp;

    if (difference > MINE_RATE) return difficulty - 1;

    return difficulty + 1;
  }
}

module.exports = Block;
