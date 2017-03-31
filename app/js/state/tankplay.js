const MAX_PLAYER_NUMBER = 8;
var socket = io();
var player = {};
//var living_oxgens;

//create a sprite from an object

  
var StateTankPlay = {
  /*
   *  State Scope Variable
  */
  
  
  /*
   *  Preload Resouce
  */
  preload: function() {
    //load game assets
    // this.load.tilemap('level1', 'assets/tiled/level1.json', null, Phaser.Tilemap.TILED_JSON);
    // this.load.image('gameTiles', 'assets/tiled/battle_city.png');
    
    //game.load.atlas('test', 'assets/tiled/battle_city.png', 'assets/tiled/sprite_frames.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);

    this.game.load.spritesheet('tiles', 'assets/tiled/battle_city.png', 16, 16, 400); // 400 means the png file have 400 (16*16) tiles
  },
  
  /*
   *  Create 
  */
  create: function() {
    var self = this;
    this.physics.startSystem(Phaser.Physics.ARCADE); // <<------------------------------------  Collision detection
    
    //enable input
    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.cursors.tab = this.game.input.keyboard.addKey(Phaser.Keyboard.TAB);
    
    //enable image text
    this.txtPx = this.game.add.bitmapText(10, 10, 'eightbitwonder', '', 8);
    this.txtPx.tint = 0xFFFFFF; //change font color
    this.txtPx.align = "center";
    //enable css text
    this.txtPxs = [];
    var style = { font: "12px Arial", fill: "#ffffff", wordWrap: true, wordWrapWidth: 100, align: "center" };
    for(var i = 0; i< MAX_PLAYER_NUMBER; i++){
        this.txtPx[i] = this.game.add.text(0, 0, "", style);
        this.txtPx[i].anchor.set(0.5);
        
        //this.txtPx[i].setText("- You have clicked -\n" + count + " times !");
        //this.txtPx[i].setTextBounds(x, y, width, height)
    }
    
    
    
    //  Create Pause and Resume Events
    this.game.onPause.add(this.onGamePause, this);
    this.game.onResume.add(this.onGameResume, this);
    
    // tiled map setup =====================================================================================
    //start tiled map
    this.map = this.game.add.tilemap('level1');
 
    //the first parameter is the tileset name as specified in Tiled, the second is the key to the asset
    this.map.addTilesetImage('battle_city', 'gameTiles');
 
    //create layer
    this.backgroundlayer = this.map.createLayer('backgroundLayer');
    this.blockedLayer = this.map.createLayer('blockedLayer');
 
    
    //resizes the game world to match the layer dimensions
    this.backgroundlayer.resizeWorld();
    this.blockedLayer.resizeWorld(); 
    
    

    
    // sprite setup =============================================================
    //Tank
    //http://stackoverflow.com/questions/25212445/adding-sprite-in-phaser-js
    this.playerTanks = [];
    for(var i=0; i<MAX_PLAYER_NUMBER; i++){
        this.playerTanks[i] = this.add.sprite(   (64+64*i), 256, 'tiles');
        this.playerTanks[i].anchor.setTo(0.5);
        this.playerTanks[i].scale.set(1.0 , 1.0);
        this.playerTanks[i].animations.add('up', [0,1], 4, true, true);
        this.playerTanks[i].animations.add('right', [6,7], 4, true, true);
        this.playerTanks[i].animations.add('down', [4,5], 4, true, true);
        this.playerTanks[i].animations.add('left', [2,3], 4, true, true);
        
        this.playerTanks[i].txtPx = this.txtPx[i];
    }
    
    // myTank is green, so, sift sprite count by +200
    var greenTankFirstTile = 200;
    this.myTank = this.add.sprite(500, 100, 'tiles', greenTankFirstTile+4);
    this.myTank.anchor.setTo(0.5);
    this.myTank.scale.set(1.0 , 1.0);
    this.myTank.animations.add('up', [greenTankFirstTile,greenTankFirstTile+1], 4, true, true);
    this.myTank.animations.add('right', [greenTankFirstTile+6,greenTankFirstTile+7], 4, true, true);
    this.myTank.animations.add('down', [greenTankFirstTile+4,greenTankFirstTile+5], 4, true, true);
    this.myTank.animations.add('left', [greenTankFirstTile+2,greenTankFirstTile+3], 4, true, true);
    this.myTank.animations.play('down');


    //========================================================================================================
    // socket.io =============================================================================================
    console.log("test socket.io, socket = ", socket);
    //var socket = io();
    // socket.emit('test', 'test-data');
    // socket.emit('echo', 'abc');
    // socket.on('echo', function (data) {
    //     console.log("data echo back from server: data = (", data, ")");
    // });
    
    
    socket.emit('first login', 'abc');
    socket.on('updates', function (data) {
        console.log("update event send back from server: data = (", data, ")");
        //console.log("update event send back from server: data.players = (", data.players, ")");
        
        for(var i = 0; i<data.players.length; i++){
            // update tank position
            // TODO: also direction
            if(data.players && data.players[i] && data.players[i].socketId == socket.id){
                // update myTank
                if(self.myTank){
                    /////console.log("update self.myTank position");
                    self.myTank.name = data.players[i].tank.name;
                    self.myTank.x = data.players[i].tank.position.x;
                    self.myTank.y = data.players[i].tank.position.y;
                }else{
                    /////console.log("self.myTank is undefined ");
                }
            }else{
                // update other player's tank
                if(self.playerTanks && self.playerTanks[i]){
                    /////console.log("data.players[i].tank.name", data.players[i].tank.name);
                    self.playerTanks[i].name = data.players[i].tank.name;
                    self.playerTanks[i].x = data.players[i].tank.position.x;
                    self.playerTanks[i].y = data.players[i].tank.position.y;
                    
                    if(data.players[i].input && data.players[i].input.previousKeyDown){
                        console.log("data.players[i].input.previousKeyDown", data.players[i].input.previousKeyDown);
                        if(data.players[i].input.previousKeyDown.up){
                            self.playerTanks[i].animations.play("up");
                        }else if(data.players[i].input.previousKeyDown.down){
                            self.playerTanks[i].animations.play("down");
                        }else if(data.players[i].input.previousKeyDown.left){
                            self.playerTanks[i].animations.play("left");
                        }else if(data.players[i].input.previousKeyDown.right){
                            self.playerTanks[i].animations.play("right");
                        }
                    }
                    
                }
            }
        }

    });
    
  },
  
  
  /*
   *  Update Loop
  */
  update: function() {
    
    if (this.cursors.left.isDown) {
        //  Move to the left
        //this.myTank.body.velocity.y = 0;
        //this.myTank.body.velocity.x = -50;
        socket.emit('input', {
            key_down:{
                left:true
            }
        });
        this.myTank.animations.play('left');
    }
    else if (this.cursors.right.isDown)
    {
        //  Move to the right
        //this.myTank.body.velocity.y = 0;
        //this.myTank.body.velocity.x = 50;
        socket.emit('input', {
            key_down:{
                right:true
            }
        });
        this.myTank.animations.play('right');
    }
    else if (this.cursors.up.isDown)
    {
        //  Move to the right
        //this.myTank.body.velocity.y = -50;
        //this.myTank.body.velocity.x = 0;
        socket.emit('input', {
            key_down:{
                up:true
            }
        });
        this.myTank.animations.play('up');
    }
    else if (this.cursors.down.isDown)
    {
        //  Move to the right
        //this.myTank.body.velocity.y = 50;
        //this.myTank.body.velocity.x = 0;
        socket.emit('input', {
            key_down:{
                down:true
            }
        });
        this.myTank.animations.play('down');
    }
    // else if (this.cursors.left.isUp) {
    //     //  stop Move to the left
    //     //this.myTank.body.velocity.y = 0;
    //     //this.myTank.body.velocity.x = 0;
    //     this.myTank.animations.stop(null, true);
    // }else if (this.cursors.down.isUp) {
    //     //  stop Move down
    //     //this.myTank.body.velocity.y = 0;
    //     //this.myTank.body.velocity.x = 0;
    //     this.myTank.animations.stop(null, true);
    // }else if (this.cursors.right.isUp) {
    //     //  stop Move to the right
    //     //this.myTank.body.velocity.y = 0;
    //     //this.myTank.body.velocity.x = 0;
    //     this.myTank.animations.stop(null, true);
    // }else if (this.cursors.up.isUp) {
    //     //  stop Move up
    //     //this.myTank.body.velocity.y = 0;
    //     //this.myTank.body.velocity.x = 0;
    //     this.myTank.animations.stop(null, true);
    // }
    
    //TAB to show information
    if (this.cursors.tab.isDown)
    {
        /////console.log("TAB pressed. this.myTank.name = ", this.myTank.name);
        this.txtPx.setText(this.myTank.name); //this.msgScore.text = "SCORE: ";
        this.txtPx.fixedToCamera = true;
        this.txtPx.cameraOffset.setTo(this.myTank.x-6, this.myTank.y-16);
        
    }
    else if (this.cursors.tab.isUp)
    {
        /////console.log("TAB pressed. this.myTank.name = ", this.myTank.name);
        this.txtPx.setText(this.myTank.name); //this.msgScore.text = "SCORE: ";
        this.txtPx.fixedToCamera = true;
        this.txtPx.cameraOffset.setTo(-10000, -10000);
    }
    
    
    //this.playerTanks
    if(this.playerTanks){
        for(var i = 0; i<this.playerTanks.length; i++){
            // this.playerTanks[i].x = 64;
            // this.playerTanks[i].y = 64;
            if(this.playerTanks[i].name){
                this.playerTanks[i].txtPx.setText(this.playerTanks[i].name);
            }else{
                this.playerTanks[i].txtPx.setText("xx");
            }
            this.playerTanks[i].txtPx.setTextBounds(this.playerTanks[i].x, this.playerTanks[i].y - 12, 64, 32);
            this.playerTanks[i].txtPx.updateText();
            this.playerTanks[i].txtPx.dirty = false
        }
    }
    
    
  },
  
  //=====================================================================================================
  /*
   *  onGamePause
  */
  onGamePause: function(){
    console.log("onGamePause");
    
  },
  
  /*
   *  onGameResume
  */
  onGameResume: function(){
    console.log("onGameResume");
    
  },
  
  

};
