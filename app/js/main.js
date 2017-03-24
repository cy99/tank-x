//initiate objects
var player = new PlayerClass(0.01,[1,2,3,4,5,6,7,8,9]);
player.score.initScore(); // increase score
player.startTicker(); // will decrease oxygen level etc.

//initiate the Phaser framework
var GAME_WIDTH = 960;
var GAME_HEIGHT = 540;
var game = new Phaser.Game(GAME_WIDTH, GAME_HEIGHT, Phaser.AUTO, 'container');

game.state.add('StateBoot',   StateBoot);
game.state.add('StateTitle',  StateTitle);
game.state.add('StateGamePlay',  StateGamePlay);
game.state.add('StateGameOver',  StateGameOver);
game.state.start('StateBoot');