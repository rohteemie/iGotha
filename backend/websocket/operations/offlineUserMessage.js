// Offline User Messages

const { redis_client } = require("../../config/redis.config");

// Ensure offline user gets their messages

async function deliverOfflineMessage(io, socket, userID) {
  try {
    // Fetch undelivered messages for the user
    const messages = await redis_client.lRange(`messages:${userID}`, 0, -1);
    console.log(`messages are: ${messages}`)

    if (messages.length > 0) {
      messages.forEach((msg) => {
        const parsedMessage = JSON.parse(msg);
        socket.emit("offlinePrivateMessage", {
          recipientId: userID,
          message: parsedMessage,
        });
      });

      // Clear the messages once delivered
      await redis_client.del(`messages:${userID}`);
      console.log(`Delivered undelivered messages to user ${userID}`);
    }
  } catch (err) {
    console.error("Error handling user connection:", err);
  }
}


module.exports = { deliverOfflineMessage };