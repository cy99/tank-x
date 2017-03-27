var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');



// System wide config
app.use(bodyParser.urlencoded({ extended: false, limit: '5mb' })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json({limit: '50mb'}));// parse application/json
app.use('/', express.static(__dirname + '/app'));



// CMS Global Constant
LI_ROOT_DIR = __dirname;
SESSION_TIMEOUT_SECONDS = 3600;

// CMS Global Route
// var route = require('./server/route');
// route.config(express, app, upload);

//get absolute uncaught Exceptions here
process.on('uncaughtException', function(err) {
    console.log('=============> Caught exception: ' + err);
});

//get uncaught application Exceptions here
app.use(function(err, req, res, next) {
    //res.end(err.message); // this catches the error!!
    if (req.xhr) {
        res.status(500).send({ error: 'Something failed!' });
    } else {
        next(err)
    }
});




var portNumber = 8081;
// app.listen(portNumber, function () {
//     console.log(`App listening on port ${portNumber}!`);
// });
http.listen(portNumber, function () {
    console.log(`App with socket.io listening on port ${portNumber}!`);
});




//Socket IO
io.on('connection', function (socket) {
    socket.on('test', function (msg) {
        // http://michaelheap.com/sending-messages-to-certain-clients-with-socket-io/
        console.log("socket.id = ", socket.id);
    });
    
    socket.on('echo', function (data) {
        // http://michaelheap.com/sending-messages-to-certain-clients-with-socket-io/
        console.log("echo command from client. data = ", data);
        io.emit('echo', data);
    });

    socket.on('cmd', function (msg) {
        if (msg == 'clear') {
            console.log('Server side catch cleared.');
        }
        console.log("cmd. socket.id = ", socket.id, "msg = ", msg);
    });
});