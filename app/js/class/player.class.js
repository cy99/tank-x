function PlayerClass(velocityMultiplier, levelScore){
    this.self = this;
    this.accelerator = new AcceleratorClass(velocityMultiplier);
    this.score = new ScoreClass(levelScore);
    this.hp = 100;
    this.mp = 100;
    this.oxygen = 100;
    this.duration = 0;
    this.FLAG_TIME_TICKER = false;
}

PlayerClass.prototype.startTicker = function(){
    //this.FLAG_TIME_TICKER = true;
    var timeInterval = setInterval(
        (function(){ 
            if(this.FLAG_TIME_TICKER){
                //decrease oxygen by 1 per second
                this.oxygen -= 1;
                //time counter
                this.duration++;
                /////console.log(this.oxygen);
            }
        }).bind(this.self), 
        1000
    );
    return true;
}


PlayerClass.prototype.resetValues = function(){
    this.hp = 100;
    this.mp = 100;
    this.oxygen = 100;
    this.duration = 0;
    this.score.score = 0;
    return true;
}




