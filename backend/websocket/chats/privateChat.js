const { redis_client } = require("../../config/redis.config");

async function handlePrivateChat(io, socket, userID) {
  socket.on("privateMessage", async ({ recipientId, message }) => {
    console.log(
      `Private message from ${socket.id} to ${recipientId}: ${message}`
    );

    try {
      const recipientSocketId = await redis_client.get(recipientId);

      if (recipientSocketId) {
        // Recipient is online; send message directly
        console.log(`recipient socket ID: ${recipientSocketId}`);
        io.to(recipientSocketId).emit("privateMessage", {
          sender: userID,
          message: `${message}`,
        });
      } else {
        // Recipient is offline; save the message in Redis
        const offlineMessage = JSON.stringify({
          sender: userID,
          message: message,
          timestamp: Date.now(),
        });
        await redis_client.rPush(`messages:${recipientId}`, offlineMessage);
        console.log(`Message saved for offline user ${recipientId}`);
      }
    } catch (err) {
      console.error("Error handling private message:", err);
    }
  });
}

module.exports = { handlePrivateChat };
