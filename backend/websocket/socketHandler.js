const { handlePrivateChat } = require('./chats/privateChat');
const { handleGroupChat } = require('./chats/groupChat');

function setupSocketHandlers(io) {
    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

        // Setup private chat handlers
        handlePrivateChat(io, socket);

        // Setup group chat handlers
        handleGroupChat(io, socket);

        // Handle disconnect
        socket.on('disconnect', () => {
            console.log('A user disconnected:', socket.id);
        });
    });
}

module.exports = { setupSocketHandlers };
