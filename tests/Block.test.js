const hexToBinary = require("hex-to-binary");

const Block = require("../Block");
const { GENESIS_DATA, MINE_RATE } = require("../config");
const cryptoHash = require("../cryptoHash");

describe("Block", () => {
  const timestamp = new Date();
  const previousHash = "hash";
  const hash = "currentHash";
  const data = ["daara", "draw"];
  const nonce = 0;
  const block = new Block({
    timestamp,
    previousHash,
    hash,
    data,
    nonce,
  });

  it("has a timestamp, previousHash, hash and data property", () => {
    expect(block.timestamp).toEqual(timestamp);
    expect(block.hash).toEqual(hash);
    expect(block.previousHash).toEqual(previousHash);
    expect(block.data).toEqual(data);
    expect(block.nonce).toEqual(nonce);
  });

  describe("Genesis block", () => {
    const genesisBlock = Block.genesis();

    it("return a Block instance", () => {
      expect(genesisBlock instanceof Block).toBe(true);
    });

    it("return the genesis data", () => {
      expect(genesisBlock).toEqual(GENESIS_DATA);
    });
  });

  describe("Mine Block", () => {
    const lastBlock = Block.genesis();
    const data = "mined data";
    const minedBlock = Block.mine({ lastBlock, data });

    it("returns a Block instance", () => {
      expect(minedBlock instanceof Block).toBe(true);
    });

    it("sets the `previousHash` to be `hash` of the lastBlock", () => {
      expect(minedBlock.previousHash).toEqual(lastBlock.hash);
    });

    it("set the `data`", () => {
      expect(minedBlock.data).toEqual(data);
    });

    it("sets a `timestamp`", () => {
      expect(minedBlock.timestamp).not.toEqual(undefined);
    });

    it("creates a SHA-256 `hash` based on the proper inputs", () => {
      expect(minedBlock.hash).toEqual(
        cryptoHash(
          minedBlock.timestamp,
          minedBlock.nonce,
          minedBlock.difficulty,
          lastBlock.hash,
          data
        )
      );
    });

    it("sets a `hash` that matched the difficulty criteria", () => {
      // expect(minedBlock.hash.substring(0, minedBlock.difficulty)).toEqual(
      //   "0".repeat(minedBlock.difficulty)
      // );   // Hex way of proof of work
      expect(
        hexToBinary(minedBlock.hash).substring(0, minedBlock.difficulty)
      ).toEqual("0".repeat(minedBlock.difficulty)); // Binary way of proof of work
    });

    it("adjusts the difficulty", () => {
      const possibleResults = [
        lastBlock.difficult + 1,
        lastBlock.difficulty - 1,
      ];

      expect(possibleResults.includes(minedBlock.difficulty)).toBe(true);
    });
  });

  describe("Adjust Difficulty", () => {
    it("raises the difficulty for quickly mined block", () => {
      expect(
        Block.adjustDifficulty({
          originalBlock: block,
          timestamp: block.timestamp + MINE_RATE - 100,
        })
      ).toEqual(block.difficulty + 1);
    });
    it("lowers the difficulty for slowly mined block", () => {
      expect(
        Block.adjustDifficulty({
          originalBlock: block,
          timestamp: block.timestamp + MINE_RATE + 100,
        })
      ).toEqual(block.difficulty - 1);
    });

    it("has a lower limit of 1", () => {
      block.difficulty = -1;

      expect(Block.adjustDifficulty({ originalBlock: block })).toEqual(1);
    });
  });
});
