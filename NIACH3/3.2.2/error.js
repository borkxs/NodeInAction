var events = require('events'),
    myEmitter = new events.EventEmitter()

myEmitter.on('error', function(err) {
    console.log('ERROR: ' + err.message)
})
myEmitter.emit('error', new Error('Something is wrong.'))

// If an error type event is emitted without an error object supplied as the 
// second argument, a stack trace will indicate an "Uncaught, unspcified 'error' 
// event" error, and your application will halt. There is a deprecated method
// you can use to deal with this error--you can define your own response by 
// defining a global handler using the following code:

// process.on('uncaughtException', function(err){
//     console.error(err.stack)
//     process.exit(1)
// })

myEmitter.emit('error', 'asdf')