const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const { storage } = require('./config/database');
const handleSocketConn = require('./services/socketHandlers');
require('./models/associations.model'); // Ensures all associations are set up
const userRouter = require('./routes/user.router');

const PORT = 3000;

const app = express();
const server = http.createServer(app);
const io = socketIO(server);


app.use(express.json());
app.use('/users', userRouter);


// Define a route
app.get('/', (req, res) => {
  res.send('Hi, Welcome to iGotha chat app.');
});

handleSocketConn(io);

// Start the server
server.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  await storage.sync();
  console.log('Database created/synced!')
});
