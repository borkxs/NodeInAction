var http = require('http'),
    fs = require('fs'),
    path = require('path'),
    mime = require('mime')

var cache = {}

var server = http.createServer(function (request, response) {
    var filePath = false,
        absPath

    if (request.url == "/")
        filePath = 'public/index.html'
    else
        filePath = 'public' + request.url

    absPath = './' + filePath
    serveStatic(response, cache, absPath)
})

server.listen(3000, function () {
    console.log("Server listening on port 3000.")
})

function serveStatic(response, cache, absPath) {
    var fileInCache = cache[absPath]

    if (fileInCache)
        sendFile(response, absPath, fileInCache)
    else
        fs.exists(absPath, function(exists) {
            if (exists)
                fs.readFile(absPath, function(err, data) {
                    if (err)
                        send404(response)
                    else {
                        cache[absPath] = data
                        sendFile(response, absPath, data)
                    }
                })
            else
                send404(response)
        })

}

function sendFile(response, filePath, fileContents) {
    console.log(mime.lookup(path.basename(filePath)))
    response.writeHead(200, {
        'Content-Type': mime.lookup(path.basename(filePath))
    })
    response.end(fileContents)
}

function send404(response) {
    response.writeHead(404, {
        'ContentType': 'text/plain'
    })
    response.write('Error 404: resource not found')
    response.end()
}