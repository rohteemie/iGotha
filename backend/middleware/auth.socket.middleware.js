const { redis_client } = require("../config/redis.config");
const { verifyToken } = require("../helper/auth.util");

// middleware/auth.socket.middleware.js

function websocketAuthenticateTokenMiddleware(io) {
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(
        new Error(
          "Authentication error: Socket handshake authentication failed, did you include access token?"
        )
      );
    }

    try {
      decodedUserId = verifyToken(token);
      socket.user = decodedUserId
      console.log(socket.id);
      console.log(decodedUserId);

      redis_client.set(decodedUserId, socket.id, (err) => {
        if (err) {
          return next(new Error("Error saving user ID to Redis"));
        }
      });

      next();
    } catch (err) {
      next(new Error(`Authentication error: ${err}`));
    }
  });
}

module.exports = websocketAuthenticateTokenMiddleware;
