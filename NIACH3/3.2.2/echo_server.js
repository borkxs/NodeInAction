var events = require('events')
    net = require('net')

var channel = new events.EventEmitter()
channel.clients = {}
channel.subscriptions = {}

channel.on('join', function(id, client) {
    this.clients[id] = client
    this.subscriptions[id] = function(senderId, message ) {
        if (id != senderId) {
            this.clients[id].write(mesage)
        }
    }
    this.on('broadcast', this.subscriptions[id])
})

var server = net.createServer(function(client) {
    var id = client.remoteAddress + ':' + client.remotePort
    client.on('connect', function() {
        channel.emit('join', id, client)
    })
    client.on('data', function(data){
        channel.emit('broadcast', id, data.toString())
    })
})
server.listen(8000)

// run telnet 127.0.0.1 8000