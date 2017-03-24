var StateBoot = {
    //load the game assets before the game starts
    preload: function() {

        this.load.image('preloaderBar', 'assets/images/loader_bar.png');
        this.load.image('titleimage', 'assets/images/TitleBG.png');   
        //this.load.spritesheet('pet', 'assets/images/pet.png', 97, 83, 5, 1, 1); 
    },
  
    //executed after everything is loaded
    create: function() {
        this.scale.minWidth = 270;
		this.scale.minHeight = 480;
        
        //scaling options
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    
        //have the game centered horizontally
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;

        //screen size will be set automatically
        // this.scale.setScreenSize(true);// not working for new version of phaser 2.4+
        
        
        //pointer
        this.input.maxPointers = 1;
        this.input.addPointer();
        
        this.state.start('StateTitle');
    },
  
    //game loop, executed many times per second
    update: function() {
    
    }
};