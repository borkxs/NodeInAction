var socketio    = require('socket.io'),
    _           = require('underscore'),
    fs          = require('fs'),    
    io,
    guestNumber     = 1,
    nickNames       = {},
    namesUsed       = [],
    currentRoom     = {}

exports.listen = function(server) {
    io = socketio.listen(server);

    io.set('log level', 1);

    io.sockets.on('connection', function(socket) {
        guestNumber = assignGuestName(socket, guestNumber, nickNames, namesUsed)
        joinRoom(socket, 'dilir.io');

        handleFeatureRequests(socket)
        handleMessageBroadcasting(socket, nickNames)
        handleNameChangeAttempts(socket, nickNames, namesUsed)
        handlRoomJoining(socket)

        socket.on('rooms', function() {
            socket.emit('rooms', _.values(currentRoom))
        })

        handleClientDisconnection(socket, nickNames, namesUsed)
    })
}

function assignGuestName(socket, guestNumber, nickNames, namesUsed) {
    var name = '$guest' + guestNumber
    nickNames[socket.id] = name;
    socket.emit('nameResult', {
        success: true,
        name: name
    })
    namesUsed.push(name)

    return guestNumber + 1
}

function joinRoom(socket, room) {
    socket.join(room)
    currentRoom[socket.id] = room
    socket.emit('joinResult', {
        room: room
    })
    socket.broadcast.to(room).emit('message', {
        text: nickNames[socket.id] + ' has joined ' + room + '.'
    })

    var usersInRoom = findClientsSocket(room)
    if (usersInRoom.length > 1) {
        var usersInRoomSummary = 'users currently in ' + room + ': '
        for (var index in usersInRoom) {
            var userSocketId = usersInRoom[index].id
            if (userSocketId != socket.id)
                if (index > 0)
                    usersInRoomSummary += ', '
            usersInRoomSummary += nickNames[userSocketId]
        }
        usersInRoomSummary += '.'
        socket.emit('message', {
            text: usersInRoomSummary
        })
    }

    function findClientsSocket(roomId, namespace) {
        var res = []
        , ns = io.of(namespace ||"/");    // the default namespace is "/"

        if (ns) {
            for (var id in ns.connected) {
                if(roomId) {
                    var index = ns.connected[id].rooms.indexOf(roomId) ;
                    if(index !== -1) {
                        res.push(ns.connected[id]);
                    }
                } else {
                    res.push(ns.connected[id]);
                }
            }
        }
        return res;
    }
}

function handleFeatureRequests(socket) {
    socket.on('featureRequest', function(message) {
        fs.stat('requests.txt', function (err, stats) {
            if (err) throw err
            if (stats.size < 10000)
                fs.appendFile('requests.txt', message + '\n', function (err) {
                    if (err) throw err
                    socket.emit('featureResult', {
                        success: true,
                        message: message
                    })
                    socket.broadcast.to(currentRoom[socket.id]).emit('message', {
                        text: 'Feature Request: ' + message
                    })
                })
        })
    })
}

function handleNameChangeAttempts(socket, nickNames, namesUsed) {
    socket.on('nameAttempt', function(name) {
        if (name.indexOf('$guest') == 0) {
            socket.emit('nameResult', {
                success: true,
                message: 'Names cannot begin with "$guest".'
            })
        } else {
            if (namesUsed.indexOf(name) == -1) {
                var previousName = nickNames[socket.id]
                var previousNameIndex = namesUsed.indexOf(previousName)
                namesUsed.push(name)
                nickNames[socket.id] = name
                delete namesUsed[previousNameIndex]

                socket.emit('nameResult', {
                    success: true,
                    name: name
                })
                socket.broadcast.to(currentRoom[socket.id]).emit('message', {
                    text: previousName + ' is now known as ' + name + '.'
                })
            } else {
                socket.emit('nameResult', {
                    success: false,
                    message: 'That name is already in use.'
                })
            }
        }
    })
}

function handleMessageBroadcasting(socket, nickNames) {
    socket.on('message', function(message) {
        var myDate = new Date()
        socket.broadcast.to(message.room).emit('message', {
            text: '[' + myDate.getHours() + ":" + myDate.getMinutes() + ":" + myDate.getSeconds() + '] ' + nickNames[socket.id] + ': ' + message.text
        })
    })
}

function handlRoomJoining(socket) {
    socket.on('join', function(room) {
        socket.leave(currentRoom[socket.id])
        joinRoom(socket, room.newRoom)
    })
}

function handleClientDisconnection(socket, nickNames, namesUsed) {
    socket.on('disconnet', function() {
        var nameIndex = namesUsed.indexOf(nickNames[socket.id])
        delete namesUsed[nameIndex]
        delete nickNames[socket.id]
    })
}