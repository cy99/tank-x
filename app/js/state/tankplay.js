var socket = io();
var tween;
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

    this.game.load.spritesheet('tiles', 'assets/tiled/battle_city.png', 16, 16, 25);
  },
  
  /*
   *  Create 
  */
  create: function() {
    this.physics.startSystem(Phaser.Physics.ARCADE); // <<------------------------------------
    
    //enable input
    this.cursors = this.game.input.keyboard.createCursorKeys();
    
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
 
    //collision on blockedLayer
    this.map.setCollisionBetween(1, 400, true, 'blockedLayer');   // <<------------------------------------
    
    //resizes the game world to match the layer dimensions
    this.backgroundlayer.resizeWorld();
    this.blockedLayer.resizeWorld();    // <<------------------------------------
    
    

    
    // sprite setup =============================================================
    //Tank
    //http://stackoverflow.com/questions/25212445/adding-sprite-in-phaser-js
    this.tank1 = this.add.sprite(500, 100, 'tiles');
    this.tank1.anchor.setTo(0.5);
    this.tank1.scale.set(1.0 , 1.0);
    this.tank1.animations.add('top', [0,1], 4, true, true);
    this.tank1.animations.add('right', [6,7], 4, true, true);
    this.tank1.animations.add('bottom', [4,5], 4, true, true);
    this.tank1.animations.add('left', [2,3], 4, true, true);
    
    
    
    this.physics.enable(this.tank1);            // <<------------------------------------
    this.tank1.body.bounce.y = 0;               // <<------------------------------------
    this.tank1.body.linearDamping = 16;         // <<------------------------------------
    this.tank1.body.collideWorldBounds = true;  // <<------------------------------------
    
    
    
    
    
    
    // socket.io =================================================================
    console.log("test socket.io, socket = ", socket);
    //var socket = io();
    socket.emit('test', 'test-data');
    socket.emit('echo', 'abc');
    socket.on('echo', function (data) {
        console.log("data echo back from server: data = (", data, ")");
    });
    
  },
  
  
  /*
   *  Update Loop
  */
  update: function() {
    this.physics.arcade.collide(this.tank1, this.blockedLayer);  // <<------------------------------------
    
    if (this.cursors.left.isDown) {
        //  Move to the left
        this.tank1.body.velocity.y = 0;
        this.tank1.body.velocity.x = -50;
        this.tank1.animations.play('left');
    }
    else if (this.cursors.right.isDown)
    {
        //  Move to the right
        this.tank1.body.velocity.y = 0;
        this.tank1.body.velocity.x = 50;
        this.tank1.animations.play('right');
    }
    else if (this.cursors.up.isDown)
    {
        //  Move to the right
        this.tank1.body.velocity.y = -50;
        this.tank1.body.velocity.x = 0;
        this.tank1.animations.play('top');
    }
    else if (this.cursors.down.isDown)
    {
        //  Move to the right
        this.tank1.body.velocity.y = 50;
        this.tank1.body.velocity.x = 0;
        this.tank1.animations.play('bottom');
    }
    else if (this.cursors.left.isUp) {
        //  stop Move to the left
        this.tank1.body.velocity.y = 0;
        this.tank1.body.velocity.x = 0;
        this.tank1.animations.stop(null, true);
    }else if (this.cursors.down.isUp) {
        //  stop Move down
        this.tank1.body.velocity.y = 0;
        this.tank1.body.velocity.x = 0;
        this.tank1.animations.stop(null, true);
    }else if (this.cursors.right.isUp) {
        //  stop Move to the right
        this.tank1.body.velocity.y = 0;
        this.tank1.body.velocity.x = 0;
        this.tank1.animations.stop(null, true);
    }else if (this.cursors.up.isUp) {
        //  stop Move up
        this.tank1.body.velocity.y = 0;
        this.tank1.body.velocity.x = 0;
        this.tank1.animations.stop(null, true);
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
