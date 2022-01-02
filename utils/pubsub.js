const redis = require("redis");

const CHANNELS = {
  TEST: "TEST",
  BLOCKCHAIN: "BLOCKCHAIN",
};

class PubSub {
  constructor({ blockchain }) {
    this.blockchain = blockchain;

    this.publisher = redis.createClient();
    this.subscriber = redis.createClient();

    this.publisher.connect();
    this.subscriber.connect();

    this.subscribeToChannels();

    this.subscriber.on("message", (channel, message) => {
      this.handleMessage(message, channel);

      const parsedMessage = JSON.parse(message);

      if (this.channel === CHANNELS.BLOCKCHAIN) {
        this.blockchain.replaceChain(parsedMessage);
      }
    });
  }

  handleMessage(channel, message) {
    console.log(`Message received. Channel: ${channel}. message: ${message} `);
  }

  subscribeToChannels() {
    Object.values(CHANNELS).forEach((channel) => {
      this.subscriber.subscribe(channel, (message, channel) => {
        this.handleMessage(channel, message);
      });
    });
  }

  publish({ channel, message }) {
    this.subscriber.unsubscribe(channel, () => {
      this.publisher.publish(channel, message, () => {
        this.subscriber.subscribe(channel);
      });
    });
  }

  broadcastChain() {
    this.publish({
      channel: CHANNELS.BLOCKCHAIN,
      message: JSON.stringify(this.blockchain.chain),
    });
  }
}

module.exports = PubSub;
