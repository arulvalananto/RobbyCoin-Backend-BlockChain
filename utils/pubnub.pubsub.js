// const PubNub = require("pubnub");

// const CHANNELS = {
//   TEST: "TEST",
// };

// class PubSub {
//   constructor() {
//     this.pubnub = new PubNub({
//       publishKey: process.env.PUBNUB_PUBLIC_KEY,
//       subscribeKey: process.env.PUBNUB_SUBSCRIBE_KEY,
//       secretKey: process.env.PUBNUB_SECRET_KEY,
//       uuid: process.env.PUBNUB_UUID,
//     });

//     this.pubnub.addListener(this.listener());
//     this.pubnub.subscribe({ channels: Object.values(CHANNELS) });
//   }

//   listener() {
//     return {
//       status: (statusEvent) => {
//         if (statusEvent.category === "PNConnectedCategory") {
//           this.publish();
//         }
//       },
//       message: (messageObject) => {
//         const { channel, message } = messageObject;
//         console.log(
//           `Message received. Channel: ${channel}. message: ${message} `
//         );
//       },
//       presence: (presenceObject) => {},
//     };
//   }

//   publish({ channel, message }) {
//     this.pubnub.publish({ channel, message });
//   }
// }

// const testPubSub = new PubSub();
// testPubSub.publish({ channel: CHANNELS.TEST, message: "hello pubnub" });

// module.exports = PubSub;
