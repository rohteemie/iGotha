function handleGroupChat(io, socket) {
    socket.on('joinGroup', (group) => {
        socket.join(group);
        console.log(`User ${socket.id} joined group ${group}`);
        socket.to(group).emit('groupNotification', `User ${socket.id} has joined the group.`);
    });

    socket.on('leaveGroup', (group) => {
        socket.leave(group);
        console.log(`User ${socket.id} left group ${group}`);
        socket.to(group).emit('groupNotification', `User ${socket.id} has left the group.`);
    });

    socket.on('groupMessage', ({ group, message }) => {
        console.log(`Message from ${socket.id} in group ${group}: ${message}`);
        io.to(group).emit('groupMessage', { sender: socket.id, message });
    });
}

module.exports = { handleGroupChat };
