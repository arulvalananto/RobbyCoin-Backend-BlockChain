const express = require("express");
const axios = require("axios");

require("dotenv").config({ path: "./config/.env" });
const AppError = require("./utils/AppError");
const Blockchain = require("./blockchain");
const PubSub = require("./utils/pubsub");
const catchAsync = require("./utils/catchAsync");
const errorHandler = require("./utils/errorHandler");

const app = express();
const blockchain = new Blockchain();
const pubsub = new PubSub({ blockchain });

const DEFAULT_PORT = process.env.PORT || 3000;
const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`;

setTimeout(() => pubsub.broadcastChain(), 1000);
app.use(express.json());

app.get("/api/blocks", (req, res) => {
  res.json(blockchain.chain);
});

app.post("/api/mine", (req, res, next) => {
  const { data } = req.body;

  if (!data)
    return next(new AppError("Please enter the data of the block", 400));

  blockchain.addBlock({ data });

  pubsub.broadcastChain();

  res.redirect("/api/blocks");
});

const syncChain = catchAsync(async (req, res, next) => {
  const response = await axios.get(`${ROOT_NODE_ADDRESS}/api/blocks`);

  console.log("replace chain on a sync with", response.data);
  blockchain.replaceChain(response.data);
});

app.use(errorHandler);

app.use("*", (req, res) => {
  res.status(405).json({
    message: `Can't find ${req.originalUrl} this route or method allowed to this route`,
  });
});

let PEER_PORT;
if (process.env.GENERATE_PEER_PORT === "true")
  PEER_PORT = +DEFAULT_PORT + Math.ceil(Math.random() * 1000);
const PORT = PEER_PORT || DEFAULT_PORT;

app.listen(PORT, () => {
  console.log(`Server running at ${PORT}`);

  if (PORT !== DEFAULT_PORT) syncChain();
});
