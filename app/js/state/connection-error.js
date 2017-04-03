var StateConnectionError = {
    /*
   *  Preload Resouce
  */
  preload: function() {
    //load game assets
    this.game.load.image('ConnectionErrorImage', 'assets/images/ConnectionError.png');
  },
  
  /*
   *  Create 
  */
  create: function() {
      this.game.world.setBounds(0, 0, 960, 540);
      this.titleImage = this.add.image(this.world.centerX, this.world.centerY, 'ConnectionErrorImage');
      this.titleImage.anchor.setTo(0.5, 0.5);
  },
  
  /*
   *  Update Loop
  */
  update: function() {
  }
}