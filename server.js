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




var portNumber = 8080;
// app.listen(portNumber, function () {
//     console.log(`App listening on port ${portNumber}!`);
// });
http.listen(portNumber, function () {
    console.log(`App with socket.io listening on port ${portNumber}!`);
});


// general functions ===========================================================
function clone(obj) {
    var copy;

    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}


// tanks=====================================================================================
const FPS = 20;
const MAX_PLAYER_NUMBER = 8;

var players = [];
var playerModel = {
    num : undefined,
    socketId: undefined,
    tank: undefined
};
var tankModel = {
    name: undefined,
    position:{
        x:undefined,
        y:undefined,
        z:undefined
    }
};



//Socket IO
var allClients = [];
io.on('connection', function (socket) {
    allClients.push(socket);
    
    socket.on('disconnect', function(){
        console.log('user disconnected');
        
        var i = allClients.indexOf(socket);
        allClients.splice(i, 1);
        
        for(var i = 0; i<MAX_PLAYER_NUMBER; i++){
            if(players[i] && players[i].socketId == socket.id){
                players.splice(i, 1);
                console.log("players = ", players)
            }
        }
        //TODO: delete player from players array
    });
      
    socket.on('test', function (msg) {
        // http://michaelheap.com/sending-messages-to-certain-clients-with-socket-io/
        console.log("socket.id = ", socket.id);
    });
    
    socket.on('echo', function (data) {
        // http://michaelheap.com/sending-messages-to-certain-clients-with-socket-io/
        console.log("echo command from client. data = ", data);
        io.emit('echo', data); //broadcast
    });

    // socket.on('cmd', function (msg) {
    //     if (msg == 'clear') {
    //         console.log('Server side catch cleared.');
    //     }
    //     console.log("cmd. socket.id = ", socket.id, "msg = ", msg);
    // });
    
    socket.on('reset', function (data) {
        players = [];
        console.log("server soft reset.");
        io.emit('reset', "server soft reset."); //broadcast
        
        for(var i =0; i< allClients.length; i++){
            allClients[i].disconnect(true);
        }
        
    });
    
    socket.on('first login', function (data) {
        // http://michaelheap.com/sending-messages-to-certain-clients-with-socket-io/
        
        if(players.length < MAX_PLAYER_NUMBER){
            var isPlayerAlreadyLogin = false;
            for(var i = 0; i<MAX_PLAYER_NUMBER; i++){
                if(players && players[i] && players[i].socketId == socket.id){
                    isPlayerAlreadyLogin = true;
                }
            }
            
            console.log("isPlayerAlreadyLogin = ", isPlayerAlreadyLogin);
            
            if(!isPlayerAlreadyLogin){
                var playerNum = players.length + 1;
            
                var player = clone(playerModel);
                player.tank = clone(tankModel);
                
                player.num = playerNum;
                player.socketId = socket.id;
                player.tank.name="P"+playerNum;
                player.tank.speed=0.1;
                if(playerNum == 1){
                    player.tank.position.x = 24,
                    player.tank.position.y = 24
                }else if(playerNum == 2){
                    player.tank.position.x = 24,
                    player.tank.position.y = 516
                }else if(playerNum == 3){
                    player.tank.position.x = 936,
                    player.tank.position.y = 24
                }else if(playerNum == 4){
                    player.tank.position.x = 936,
                    player.tank.position.y = 516
                }else if(playerNum == 5){
                    player.tank.position.x = 96,
                    player.tank.position.y = 96
                }else if(playerNum == 6){
                    player.tank.position.x = 96,
                    player.tank.position.y = 452
                }else if(playerNum == 7){
                    player.tank.position.x = 872,
                    player.tank.position.y = 96
                }else if(playerNum == 8){
                    player.tank.position.x = 872,
                    player.tank.position.y = 452
                }
                players.push(player);
                socket.player = player;
                
                var rs = {status:1, info:"server asign a tank to you.", data:player};
                /////io.emit('first login rs ', rs);
                io.sockets.connected[socket.id].emit('first login rs ', rs);
            }else{
                var rs = {status:0, info:"you already login.", data:undefined};
                io.sockets.connected[socket.id].emit('first login rs ', rs);
            }
            
        }else{
            var rs = {status:0, info:"max player number reachs.", data:undefined};
            io.sockets.connected[socket.id].emit('first login rs ', rs);
        }
        
    });

    
    
    socket.on('input', function (data) {
        if(socket.player){
            socket.player.input = data;
            console.log("socket.player.input = ",socket.player.input);
        }else{
            //error: please 'login first'
            console.log("error: please 'login first'");
        }
        
    });
    
});

    

    
setInterval(function() {
    
//   for(var i=0; i<allClients.length; i++){
//       if(allClients[i].player){
//           //单发给指定socket
//           //io.sockets.connected[allClients[i].id].emit('player update'  , allClients[i].player);
//           //console.log('player update'  , allClients[i].player);
//       }
//   }
  
  //TODO: process game logic here
    for(var i=0; i<allClients.length; i++){
        if(allClients[i].player && allClients[i].player.input){
            var playerInput;
            var playerTank;
            var distanceDelta = allClients[i].player.tank.speed * FPS;
            playerInput = allClients[i].player.input;
            playerTank = allClients[i].player.tank;
            
            
            /////console.log("playerInput",playerInput);
            /////console.log("playerTank", playerTank);
            
            if(playerInput.key_down && playerInput.key_down.up){
                playerTank.position.y -= distanceDelta;
            }else if(playerInput.key_down && playerInput.key_down.down){
                playerTank.position.y += distanceDelta;
            }else if(playerInput.key_down && playerInput.key_down.left){
                playerTank.position.x -= distanceDelta;
            }else if(playerInput.key_down && playerInput.key_down.right){
                playerTank.position.x += distanceDelta;
            }else if(playerInput.key_down && playerInput.key_down.space){
                //TODO: fire
                
            }
            
            /////console.log("playerTank", playerTank);
            
            playerInput.key_down = {};
            
        }
    }
  
  //群发给每个player (不是每一个socket，这样节省带宽)
  var updateData = {
      time: Math.floor(Date.now()),
      players:players
  };
  io.emit("updates", updateData);
  
}, 1000 );//TODO: should < 50ms