var StateTitle = {
  ready:false,
  preloadBar:null,
  addedPressStartEvent:false,
  //load the game assets before the game starts
  preload: function() {
      //Preload Bar
      this.preloadBar = this.add.sprite(this.world.centerX, this.world.centerY +200, 'preloaderBar');
  		this.preloadBar.anchor.setTo(0.5, 0.5);
  		this.load.setPreloadSprite(this.preloadBar);
  		
  		//Load Game Play Resources
      this.load.bitmapFont('eightbitwonder', 'assets/fonts/eightbitwonder.png', 'assets/fonts/eightbitwonder.fnt');
      //this.load.bitmapFont('font', 'assets/fonts/font.png', 'assets/fonts/font.fnt');
      this.load.image('blackBG', 'assets/images/BlackBG.png');
      this.load.spritesheet('sPlayer', 'assets/images/sprite/rsz_buzz.png');
      this.load.spritesheet('rock', 'assets/images/sprite/small_rock.png');
      this.load.spritesheet('oxgen', 'assets/images/sprite/oxgentank.png');
      this.game.load.image('starfield', 'assets/images/sprite/starfield.png');
      this.game.load.image('background', 'assets/images/sprite/background2.png');
      this.game.load.image('arrow', 'assets/images/sprite/longarrow2.png');
      
      //  Load Sound
      this.load.audio('audio_explosion', 'assets/sounds/explosion.mp3');
      this.load.audio('audio_ding', 'assets/sounds/ding.mp3');
      this.load.audio('audio_bgm', 'assets/sounds/bgm.mp3');
      this.load.audio('audio_hurt', 'assets/sounds/hurt.mp3');
      
  },
  
  //executed after everything is loaded
  create: function() {
    this.titleImage = this.add.image(this.world.centerX, this.world.centerY, 'titleimage');
    this.titleImage.anchor.setTo(0.5, 0.5);
    this.titleImage.inputEnabled = true;
    
    this.msg = this.game.add.bitmapText(350, 340, 'eightbitwonder', '', 20);
  },
  
  //game loop, executed many times per second
  update: function() {
      
      if(this.cache.isSoundDecoded('audio_bgm') && this.ready == false) {
          this.ready = true;
          
          if(!this.addedPressStartEvent){
            this.addedPressStartEvent = true;
            this.titleImage.events.onInputDown.addOnce(this.startGame, this); //addOnce(this.startGame, this)
          }
      }
      
      if(!this.addedPressStartEvent){
        this.msg.setText(" LOADIIIIIIIING ");
        this.msg.tint = 0xFF3333; //change font color
      }else{
        this.msg.setText("PRESS TO START");
        this.msg.tint = 0x00FFFF; //change font color
      }
      
  },
  
  startGame: function (pointer) {
    if(this.ready){
      // TODO: get resource ready, then turn on this.
	    // this.state.start('StateGamePlay');
    }
	}
};