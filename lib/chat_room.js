var socketio = require('socket.io'),
    io,
    guestNumber = 1,
    nickNames = {},
    namesUsed = [],
    currentRoom = {}

exports.listen = function(server) {
    io = socketio.listen(server);
    io.set('log level', 1);

    io.sockets.on('connection', function (socket) {
        guestNumber = assignGuestName(socket, guestNumber, nickNames, namesUsed)
        joinRoom(socket, 'Lobby');

        handleMessageBroadcasting(socket, nickNames)
        handleNameChangeAttempts(socket, nickNames, namesUsed)
        handlRoomJoining(socket)

        socket.on('rooms', function() {
            socket.emit('rooms', io.sockets.manager.rooms)
        })

        handleClientDisconnection(socket, nickNames, namesUsed)
    })
}

function assignGuestName (socket, guestNumber, nickNames, namesUsed) {
    var name = 'Guest' + guestNumber
    nickNames[socket.id] = names
    socket.emit('nameResult', {
        success: true,
        name: name
    })
    namesUsed.push(name)

    return guestNumber + 1
}

function joinRoom (socket, room) {

}

function handleMessageBroadcasting (socket, nickNames) {

}

function handleNameChangeAttempts (socket, nickNames, namesUsed) {

}

function handlRoomJoining (socket) {

}

function handleClientDisconnection (socket, nickNames, namesUsed) {

}