var tween;
//var living_oxgens;
  
var StateGamePlay = {
  /*
   *  State Scope Variable
  */
  isPointerDown:false,
  worldSize:30000000,
  
  /*
   *  Preload Resouce
  */
  preload: function() {
    this.game.time.advancedTiming = true;
  },
  
  /*
   *  Create 
  */
  create: function() {
    // Physics
    //  We're going to be using physics, so enable the Arcade Physics system
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.world.setBounds(0, 0, this.worldSize, this.worldSize);
    
    //  Create Pause and Resume Events
    this.game.onPause.add(this.onGamePause, this);
    this.game.onResume.add(this.onGameResume, this);
    
    //BG
    //  this.blackBG = this.add.image(this.world.centerX, this.world.centerY, 'background');
    //  this.blackBG.anchor.setTo(0.5, 0.5);
    //  this.blackBG.inputEnabled = true;
    //  this.blackBG.events.onInputDown.add(this.clickBG, this);
    //  The scrolling starfield background
    this.starfield = this.game.add.tileSprite(0, 0, this.worldSize, this.worldSize, 'starfield');
    this.starfield.inputEnabled = true;
    this.starfield.events.onInputDown.add(this.BGdown, this);
    this.starfield.events.onInputUp.add(this.BGup, this);
    
    //Bitmap Text
    this.msgScore = this.game.add.bitmapText(10, 10, 'eightbitwonder', '', 20);
    this.msgScore.tint = 0xFFFFFF; //change font color
    //this.msgScore.align = "center";
    //this.msgScore.inputEnabled = true;
    //this.msgScore.events.onInputDown.addOnce(this.myFunction, this);
    this.msgLevel = this.game.add.bitmapText(10, 10, 'eightbitwonder', '', 20);
    this.msgLevel.tint = 0xFFFFFF; //change font color
    this.msgHP = this.game.add.bitmapText(10, 50, 'eightbitwonder', '', 20);
    this.msgHP.tint = 0xFFFFFF; //change font color
    this.msgOxygen = this.game.add.bitmapText(10, 50, 'eightbitwonder', '', 20);
    this.msgOxygen.tint = 0xFFFFFF; //change font color
    
    this.msgFPS = this.game.add.bitmapText(10, 900, 'eightbitwonder', '', 10);
    this.msgFPS.tint = 0xFFFFFF; //change font color
    this.msgXY = this.game.add.bitmapText(10, 10, 'eightbitwonder', '', 10);
    this.msgXY.tint = 0xFFFFFF; //change font color
    
    //Audio
    this.audioBGM = this.add.audio('audio_bgm');
    this.audioBGM.play('', 0, 0.3, true);
    this.audioBoom = this.add.audio('audio_explosion');
    this.audioDing = this.add.audio('audio_ding');
    //this.audioBoom.volume = 0.2; this.audioBoom.play(); // play boom once
    //this.audioDing.volume = 0.2; this.audioDing.play(); // play ding once
    
    //Player
    this.sPlayer = this.add.sprite(this.world.centerX, this.world.centerY, 'sPlayer');
    this.sPlayer.anchor.setTo(0.5);
    this.sPlayer.scale.set(0.5 , 0.5);
    this.sPlayer.inputEnabled = true;
    this.sPlayer.events.onInputDown.add(this.clickPlayer, this);
    this.game.physics.enable(this.sPlayer, Phaser.Physics.ARCADE);
    this.sPlayer.body.bounce.set(1);
    
  
    this.game.camera.follow(this.sPlayer);
    
    
    //rocks
    this.rocks = this.game.add.physicsGroup(Phaser.Physics.ARCADE);

  	for (var i = 0; i < 50; i++) {
  		var rock = this.rocks.create(this.game.rnd.integerInRange(0,2000), this.game.rnd.integerInRange(0, 2000), 'rock');
  		rock.body.setSize(5,8,2,4);
  		rock.body.velocity.set(this.game.rnd.integerInRange(-200, 200), this.game.rnd.integerInRange(-200, 200));

  	}
  	this.rocks.setAll('body.collideWorldBounds', true);
  	this.rocks.setAll('body.bounce.x', 1);
  	this.rocks.setAll('body.bounce.y', 1);
  	
  	
  	//oxgens
    this.oxgens = this.game.add.physicsGroup(Phaser.Physics.ARCADE);
  	this.oxgensCreate(5);
  	living_oxgens = 5;
  	this.oxgens.setAll('body.collideWorldBounds', true);
  	this.oxgens.setAll('body.bounce.x', 1);
  	this.oxgens.setAll('body.bounce.y', 1);

    
    //enable physics on player
    this.game.physics.enable(this.sPlayer, Phaser.Physics.ARCADE);
    this.cursors = this.game.input.keyboard.createCursorKeys();
    
    // Game Logic
    this.sPlayer.body.x = this.worldSize/2;
    this.sPlayer.body.y = this.worldSize/2;
      
    player.resetValues();
    player.score.FLAG_SCORE_TIME_TICKER = true;
    player.FLAG_TIME_TICKER = true;
    
    //add a arrow on the right bottom of the game
    this.arrow = this.add.sprite(10, 10, 'arrow');
    this.arrow.anchor.setTo(0.1, 0.5);
    
    
  },
  
  
  /*
   *  Update Loop
  */
  update: function() {
    
    //改变逻辑， 不是kil或者destroy，瞬移到边缘
    /*
    check living oxgen tanks. if 0, recreate.
    if (living_oxgens === 0) {
      this.oxgens.revive(); 
      living_oxgens = 5;
    }
    */
    
    //寻找距离最近的氧气罐，绿色箭头指向。 ———————— 皇牌空战～ 导弹发射～
    //哈哈，这个箭头有点囧。
    this.arrow.fixedToCamera = true;
    this.arrow.cameraOffset.setTo(450, 850);
    this.detectOneOxgen();
    
    
    //Input Control
    //   Pointer Control Player Accleration
    if(this.isPointerDown){
      var accDelta = this.maneuver();
      
      if (accDelta.dx < 0) {
        this.sPlayer.angle = -15;  
      } else if (accDelta.dx > 0) {
        this.sPlayer.angle = 15;  
      }
      
      var playerCurrentVX = this.sPlayer.body.velocity.x;
      var playerCurrentVY = this.sPlayer.body.velocity.y;
      
      if (playerCurrentVX < 100 || playerCurrentVX > -100) {
        this.sPlayer.body.velocity.x += accDelta.dx;
      } else if (playerCurrentVX > 100){
        this.sPlayer.body.velocity.x = 100;
      } else if (playerCurrentVX < -100) {
        this.sPlayer.body.velocity.x = -100;
      }
      
      if (playerCurrentVY < 100 || playerCurrentVY > -100) {
        this.sPlayer.body.velocity.y += accDelta.dy;
      } else if (playerCurrentVY > 100){
        this.sPlayer.body.velocity.y = 100;
      } else if (playerCurrentVY < -100) {
        this.sPlayer.body.velocity.y = -100;
      }
      
      
      //console.log(accDelta);
      //console.log(" Position:("+this.game.input.x+","+this.game.input.y+")");
    }
    //  Keyboard Control
    if (this.cursors.left.isDown){
      this.sPlayer.angle = -15;  
  		this.sPlayer.body.velocity.x -= 10;
    } else if (this.cursors.right.isDown) {
      this.sPlayer.angle = 15;    
  		this.sPlayer.body.velocity.x += 10;
    }
    if (this.cursors.up.isDown) {
    	this.sPlayer.body.velocity.y -= 10;
    }
    else if (this.cursors.down.isDown) {
       this.sPlayer.body.velocity.y += 10;
    }
    /////console.log(this.sPlayer);
    
    
    // Text Messages
    this.msgScore.setText("SCORE: "+player.score.score); //this.msgScore.text = "SCORE: ";
    this.msgScore.fixedToCamera = true;
    this.msgScore.cameraOffset.setTo(10, 10);
    //this.msgScore.tint = 0xAAAAAA; //change font color
    
    this.msgLevel.setText("LEVEL: "+player.score.level); 
    this.msgLevel.fixedToCamera = true;
    this.msgLevel.cameraOffset.setTo(400, 10);
    
    this.msgXY.setText(""+Math.floor(this.sPlayer.body.x)+" x "+Math.floor(this.sPlayer.body.y)+""); 
    this.msgXY.fixedToCamera = true;
    this.msgXY.cameraOffset.setTo(370, 40);
    
    this.msgFPS.setText("FPS "+this.game.time.fps); 
    this.msgFPS.fixedToCamera = true;
    this.msgFPS.cameraOffset.setTo(475, 65);
    
    this.msgHP.setText("HP  "+player.hp); 
    this.msgHP.fixedToCamera = true;
    this.msgHP.cameraOffset.setTo(10, 40);
    
    this.msgOxygen.setText("Oxygen  "+player.oxygen); 
    this.msgOxygen.fixedToCamera = true;
    this.msgOxygen.cameraOffset.setTo(10, 65);
    
    //GameOver
    // Game Over if player out of world limits
    if(this.sPlayer.body.x<0 || this.sPlayer.body.x>this.worldSize || this.sPlayer.body.y<0 || this.sPlayer.body.x>this.sPlayer.body.x){
      //TODO: before gameover, we need warning user that they went too far away.
      //      or, we should give limited oxgin supply so that player will die before reach to the margin.
      this.state.start('StateGameOver');
    }
    
    if(player.oxygen<=0){
      console.log("Out of Oxygen!");
      this.state.start('StateGameOver');
    }
    
    // Other test codes
    //    this.starfield.tilePosition.y += 2;
    //    this.sPlayer.angle = 0;   
    
    
    //Objects
    // Rock rotation
    this.rocks.forEach(function(rock) {
        rock.angle += 1;
    }, this);
    // Rock. if rock out of inner box area, reset x and y for rock
    this.rocks.forEach(function(rock) {
      var resetRockMaxDistance = 2000;
      var resetRockMinDistance = 500;
      if(this.game.physics.arcade.distanceBetween(rock,this.sPlayer)>resetRockMaxDistance){
        var tmpX = this.sPlayer.body.x;
        var tmpY = this.sPlayer.body.y;
        while(Math.abs(tmpX - this.sPlayer.body.x)<resetRockMinDistance ){
          tmpX = this.game.rnd.integerInRange(this.sPlayer.body.x - resetRockMaxDistance, this.sPlayer.body.x + resetRockMaxDistance);
        }
        while(Math.abs(tmpY - this.sPlayer.body.y)<resetRockMinDistance){
          tmpY = this.game.rnd.integerInRange(this.sPlayer.body.y - resetRockMaxDistance, this.sPlayer.body.y + resetRockMaxDistance);
        }
        rock.body.x = tmpX;
        rock.body.y = tmpY;
      }
    }, this);
    
    
    // Rock rotation
    this.oxgens.forEach(function(oxgen) {
        oxgen.angle += 1;
    }, this);
    //
    this.oxgens.forEach(function(oxgen) {
      var resetOxgenMaxDistance = 2000;
      var resetOxgenMinDistance = 500;
      if(this.game.physics.arcade.distanceBetween(oxgen,this.sPlayer)>resetOxgenMaxDistance){
        var tmpX = this.sPlayer.body.x;
        var tmpY = this.sPlayer.body.y;
        while(Math.abs(tmpX - this.sPlayer.body.x)<resetOxgenMinDistance ){
          tmpX = this.game.rnd.integerInRange(this.sPlayer.body.x - resetOxgenMaxDistance, this.sPlayer.body.x + resetOxgenMaxDistance);
        }
        while(Math.abs(tmpY - this.sPlayer.body.y)<resetOxgenMinDistance){
          tmpY = this.game.rnd.integerInRange(this.sPlayer.body.y - resetOxgenMaxDistance, this.sPlayer.body.y + resetOxgenMaxDistance);
        }
        oxgen.body.x = tmpX;
        oxgen.body.y = tmpY;
      }
    }, this);
    
    
    //Collide and Overlap events
    this.game.physics.arcade.collide(this.sPlayer, this.rocks, this.hitPlayer, null, this);
    this.game.physics.arcade.overlap(this.sPlayer, this.oxgens, this.o2Player, null, this);
    
  },
  
  //=====================================================================================================
  /*
   *  onGamePause
  */
  onGamePause: function(){
    console.log("onGamePause, DO: player.score.stopScore();");
    //player.score.stopScore();
    player.score.FLAG_SCORE_TIME_TICKER = false;
    player.FLAG_TIME_TICKER = false;
    
  },
  
  /*
   *  onGameResume
  */
  onGameResume: function(){
    console.log("onGameResume, DO: player.score.startScore();");
    //player.score.startScore();
    player.score.FLAG_SCORE_TIME_TICKER = true;
    player.FLAG_TIME_TICKER = true;
  },
  
  /*
   *  clickPlayer
  */
  clickPlayer: function(sprite, event){
    console.log(sprite);
  },
  
  /*
   *  BGdown
  */
  BGdown: function(pointer, event){
    this.isPointerDown = true;
  },
  
  /*
   *  BGup
  */
  BGup: function(pointer, event){
    this.isPointerDown = false;
  },
  
  /*
   *  maneuver
  */
  maneuver: function(){
    var pointerDelta = player.accelerator.getDistance(GAME_WIDTH/2,GAME_HEIGHT/2,this.game.input.x,this.game.input.y);
    //console.log("this.mouseDelta(click delta) =",this.mouseDelta);
    return pointerDelta;
  },
  
  /*
   *  downInput
  */
  downInput: function(pointer, event){
    //console.log(pointer);
    //console.log(event);
  },
  
  /*
   *  hitPlayer
  */
  hitPlayer: function(sPlayer, rock) {
    // Removes the player from the screen
    player.hp -= 10;
    this.audioBoom.play();
    
    console.log("hp : " + player.hp);
    if(player.hp <= 0){
      sPlayer.kill();
    }
    /////console.log("hitted");
  },
  
  /*
   *  o2Player
  */
  o2Player: function(sPlayer, oxgen) {
    var o2index = this.oxgens.getIndex(oxgen);
    console.log("oxgen index: " + o2index);
    // add the player oxgen and remove the o2 tank from the screen
    player.oxygen += 10;
    /*
    living_oxgens = living_oxgens - 1;
    if (living_oxgens < 0) {
      living_oxgens = 0;
    }
    */
    //改变逻辑， 不是kil或者destroy，瞬移到边缘
    oxgen.body.x = this.game.rnd.integerInRange(0,2000);
    oxgen.body.y = this.game.rnd.integerInRange(0,2000);
    oxgen.body.velocity.set(this.game.rnd.integerInRange(-200, 200), this.game.rnd.integerInRange(-200, 200));
    console.log("oxygen : " + player.oxygen);
    /////console.log("hitted");
    this.detectOneOxgen();
  },
  
  oxgensCreate: function(oxgen_num) {
    for (var i = 0; i < oxgen_num; i++) {
    	var oxgen = this.oxgens.create(this.game.rnd.integerInRange(0,2000), this.game.rnd.integerInRange(0, 2000), 'oxgen');
    	//oxgen.body.setSize(5,8,2,4);
    	oxgen.body.velocity.set(this.game.rnd.integerInRange(-200, 200), this.game.rnd.integerInRange(-200, 200));
  
    }
  },
  
  detectOneOxgen:function() {
    var distance = new Array();      
    
    this.oxgens.forEach(function(oxgen) {
        var objDistance = this.game.physics.arcade.distanceBetween(this.sPlayer, oxgen);
        distance.push(objDistance);
    }, this);
    //console.log(distance);
    var index_oxgen = distance.indexOf(Math.min.apply(Math, distance));
    //console.log('function detected index: ' + index_oxgen);
    
    var selectOxgen = this.oxgens.getAt(index_oxgen);
    
    var setRotation = this.game.physics.arcade.angleBetween(this.sPlayer, selectOxgen);
    //console.log("angle: " + setRotation);
    if (this.arrow.rotation > setRotation) {
      this.arrow.angle -= 1;
    } else if (this.arrow.rotation < setRotation) {
      this.arrow.angle += 1;
    }
    
  }

};
