var StateGameOver = {
    //load the game assets before the game starts
    preload: function() {
        this.game.load.image('GameOverImage', 'assets/images/GameOver.png');   
    },
  
    //executed after everything is loaded
    create: function() {
        this.game.world.setBounds(0, 0, 540, 960);
        this.titleImage = this.add.image(this.world.centerX, this.world.centerY, 'GameOverImage');
        this.titleImage.anchor.setTo(0.5, 0.5);
        this.titleImage.inputEnabled = true;
        this.titleImage.events.onInputDown.addOnce(this.startGame, this);
        
        //Bitmap Text
        this.msgScore = this.game.add.bitmapText(10, 10, 'eightbitwonder', '', 24);
        this.msgScore.tint = 0xFFFFFF; //change font color
        this.msgDuration = this.game.add.bitmapText(50, 10, 'eightbitwonder', '', 24);
        this.msgDuration.tint = 0xFFFFFF; //change font color
        
        this.over_score = player.score.score;
        this.over_duration = player.duration;
        
        player.score.FLAG_SCORE_TIME_TICKER = false;
        player.FLAG_TIME_TICKER = false;
    },
  
    //game loop, executed many times per second
    update: function() {
        this.msgScore.setText(""+this.over_score); //this.msgScore.text = "SCORE: ";
        this.msgScore.fixedToCamera = true;
        this.msgScore.cameraOffset.setTo(300, 386);
        
        this.msgDuration.setText(""+this.over_duration+" s");
        this.msgDuration.fixedToCamera = true;
        this.msgDuration.cameraOffset.setTo(300, 430);
        //console.log(this.input.pointer.isDown);
        /*
        if(this.input.pointer1.isDown){
          this.state.start('StateGamePlay');
        }
        //*/
    },
  
    startGame: function (pointer) {
	  this.state.start('StateGamePlay');
	}
};