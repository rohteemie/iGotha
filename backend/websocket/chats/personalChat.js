function handlePrivateChat(io, socket) {
    socket.on('personalMessage', ({ recipientId, message }) => {
        console.log(`Personal message from ${socket.id} to ${recipientId}: ${message}`);
        io.to(recipientId).emit('privateMessage', { sender: socket.id, message: `${message}, I have sent back the message` });
    });
}

module.exports = { handlePrivateChat };
