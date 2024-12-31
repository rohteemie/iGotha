const { Server, socketIO } = require('socket.io');
const http = require('http');
const { storage } = require('./config/database');
// const handleSocketConn = require('./services/socketHandlers');
// require('./models/associations.model');
const { setupSocketHandlers } = require('./websocket/socketHandler');
const app = require('./app');
const websocketAuthenticateTokenMiddleware = require('./middleware/auth.socket.middleware');


const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// plug in middlewares
websocketAuthenticateTokenMiddleware(io)

// plug in SocketIO handler
setupSocketHandlers(io);


const PORT = process.env.PORT || 3000;
server.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await storage.sync();
  console.log('Database created/synced!')
});
