const { handlePrivateChat } = require("./chats/privateChat");
const { handleGroupChat } = require("./chats/groupChat");
const { deliverOfflineMessage } = require("./operations/offlineUserMessage");
const { verifyToken } = require("../helper/auth.util");
const { redis_client } = require("../config/redis.config");

function setupSocketHandlers(io) {
  io.on("connection", (socket) => {
      userID = verifyToken(socket.handshake.auth.token);
      console.log("A user connected:", socket.id, userID);

    deliverOfflineMessage(io, socket, userID);

    // Setup private chat handlers
    handlePrivateChat(io, socket, userID);

    // Setup group chat handlers
    handleGroupChat(io, socket);

    // Handle connect
    socket.on("connect", () => {
      deliverOfflineMessage(io, socket, userID);
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      console.log(
        "A user disconnected. here is the socket id and user id:",
        socket.id,
        userID
      );
      redis_client.del(`${userID}`);
      console.log(`\n\ndeleted user ${userID}\n\n`);
    });
  });
}

module.exports = { setupSocketHandlers };
