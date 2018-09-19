var http = require('http');
var express = require("express");
var app = express();
var port = process.env.PORT || 3000;

/*http.createServer(function (req, res) {
    
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('Hello, world!');
    
}).listen(process.env.PORT || 8080);*/

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

app.listen(port, () => {
    console.log("Server listening on port " + port);
});