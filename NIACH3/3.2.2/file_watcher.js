var events = require('events'),
    util = require('util')

function Watcher(watchDir, processedDir) {
    this.watchDir       = watchDir
    this.processedDir   = processedDir
}

util.inherits(Watcher, events.EventEmitter)

// equivalent to:
// Watcher.prototype = new events.EventEmitter()

module.exports = Watcher