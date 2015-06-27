var events = require('events')
    net = require('net')

var channel = new events.EventEmitter()
channel.clients = {}
channel.subscriptions = {}

var server = net.createServer(function(client) {
    var id = client.remoteAddress + ':' + client.remotePort

    // setup client handler
    channel.clients[id] = client
    channel.subscriptions[id] = function(senderId, message) {
        if ( id != senderId )
            channel.clients[id].write(message)
    }

    // subscribe client to broadcasts
    channel.on('broadcast', channel.subscriptions[id])

    // broadcast data from client
    client.on('data', function(data) {
        channel.emit('broadcast', id, data.toString())
    })
})
server.listen(8000)

// run telnet 127.0.0.1 8000