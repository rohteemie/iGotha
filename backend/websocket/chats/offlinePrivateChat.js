const { redis_client } = require("../../config/redis.config");

async function handleOfflinePrivateChat(io, socket, userID) {
  socket.on("offlinePrivateMessage", async ({ recipientId, message }) => {
    console.log(
      `Offline private message from ${socket.id} to ${recipientId}: ${message}`
    );

    try {
      const recipientSocketId = await redis_client.get(recipientId);

      if (recipientSocketId) {
        // Recipient is online; send message
        console.log(`recipient socket ID: ${recipientSocketId}`);
        io.to(recipientSocketId).emit("offlinePrivateMessage", {
          sender: userID,
          message: `${message}`,
        });
      } else {
        await redis_client.rPush(`messages:${recipientId}`, message);
        console.log(`Message saved for offline user ${recipientId}`);
      }
    } catch (err) {
      console.error("Error handling private message:", err);
    }
  });
}

module.exports = { handleOfflinePrivateChat };
