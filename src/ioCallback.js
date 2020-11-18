module.exports = io => {
    function ioCallback(socket) {

        socket.on('join', async (roomID, callback) => {
            const socketIds = await socketIdsInRoom(roomID);
            callback(socketIds);
            socket.join(roomID);
            socket.room = roomID;
        });

        socket.on("exchange", data => {
            data.from = socket.id;
            const to = io.sockets.connected[data.to];
            if (to) {
                to.emit('exchange', data);
            }
        });
        socket.on("disconnect", async () => {
            if (socket.room) {
                const room = socket.room;
                io.to(room).emit("leave", socket.id);
                socket.leave(room);
            }
        });
    }

    const socketIdsInRoom = roomID => {
        return new Promise(resolve => {
            io.sockets.in(roomID).clients((err, clients) => {
                resolve(clients);
            });
        });
    };

    return { ioCallback };
};
