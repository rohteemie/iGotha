const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const { storage } = require('./config/database');
const handleSocketConn = require('./services/socketHandlers');
require('./models/associations.model');
const authRoutes = require('./routes/auth.route');
const userRoutes = require('./routes/user.route');

const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.json());
app.use('/users', userRoutes);
app.use('/users', authRoutes);

app.get('/', (req, res) => {
  res.send('Hi, Welcome to iGotha chat app.');
});

handleSocketConn(io);

server.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await storage.sync();
  console.log('Database created/synced!')
});
