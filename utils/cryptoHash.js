const crypto = require("crypto");

const cryptoHash = (...arg) => {
  return crypto.createHash("sha256").update(arg.sort().join(" ")).digest("hex");
};

module.exports = cryptoHash;
