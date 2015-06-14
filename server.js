var http = require('http'),
	fs = require('fs'),
	path = require('path'),
	mime = require('mime')

var cache = {}

function send404(response) {
	res.writeHead(404, {
		'ContentType': 'text/plain'
	})
	res.write('Error 404: resource not found')
	response.end()
}

function sendFile(response, filePath, fileContents) {
	response.writeHead(200, {
		'Content-Type': mime.lookup(path.basename(filePath))
	});
	response.end(fileContents)
}

function serverStatc(response, cache, absPath) {
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
						sendFile(response, cache, data)
					}
				})
			else
				send404(response)
		})

}