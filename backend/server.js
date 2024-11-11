const socketIO = require('socket.io');
const http = require('http');
const { storage } = require('./config/database');
// const handleSocketConn = require('./services/socketHandlers');
// require('./models/associations.model');
const app = require('./app');


const server = http.createServer(app);
const io = socketIO(server);


// handleSocketConn(io);

const PORT = process.env.PORT || 3000;
server.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await storage.sync();
  console.log('Database created/synced!')
});
