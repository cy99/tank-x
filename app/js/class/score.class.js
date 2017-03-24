function ScoreClass(levels){
    this.self = this;
    this.FLAG_SCORE_TIME_TICKER = false;
    this.score = 0;
    this.levels = levels; //eg. level 1 will increase score for every each second of time
    this.level = 0;
}

ScoreClass.prototype.initScore = function(){
    //this.FLAG_SCORE_TIME_TICKER = true;
    var timeInterval = setInterval(
        (function(){ 
            if(this.FLAG_SCORE_TIME_TICKER){
                if(this.level >= this.levels.length){
                    this.level = this.levels.length - 1;
                }
                this.score += this.levels[this.level];
            }
            //console.log(this.score);
        }).bind(this.self), 
        1000
    );
    return true;
}

ScoreClass.prototype.startScore = function(){
    this.FLAG_SCORE_TIME_TICKER = true;
    return true;
}

ScoreClass.prototype.stopScore = function(){
    this.FLAG_TIME_TICKER = false;
    this.level = 0;
    return false;
}

ScoreClass.prototype.setLevel = function(level){
    this.level = level;
    return true;
}
