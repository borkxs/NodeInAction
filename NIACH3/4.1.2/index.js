/*
res.setHeader(field, value);
res.getHeader(field);
res.removeHeader(field);
*/

var http = require('http');
var server = http.createServer(function (req, res) {
    var body = 'Hello World';
    res.setHeader('Content-Length', 'text/plain');
    res.setHeader('Content-Type', 'text/plain');
    res.end(body);
});
server.listen(3000);