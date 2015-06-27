var events = require('events'),
    myEmitter = new events.EventEmitter()

myEmitter.on('error', function(err) {
    console.log('ERROR: ' + err.message)
})
myEmitter.emit('error', new Error('Something is wrong.'))