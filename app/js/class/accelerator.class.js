function AcceleratorClass(velocityMultiplier){
    this.velocityMultiplier = velocityMultiplier;
    if(velocityMultiplier)
        this.velocityMultiplier = velocityMultiplier;
    else
        this.velocityMultiplier = 1;
}

// return distance between two points
AcceleratorClass.prototype._getDistance = function(x1,y1,x2,y2){
    var dx = x2-x1;
    var dy = y2-y1;
    var distance = {dx:dx*this.velocityMultiplier, dy:dy*this.velocityMultiplier};
    return distance;
}

AcceleratorClass.prototype.getDistance = function(){
    var x1,y1,x2,y2;
    if(arguments.length == 2){ //argument is ({x,y},{x,y})
        x1 = arguments[0].x;
        y1 = arguments[0].y;
        x2 = arguments[1].x;
        y2 = arguments[1].y;
    }else if(arguments.length == 4){ // argument is (x1,y1,x2,y2)
        x1 = arguments[0];
        y1 = arguments[1];
        x2 = arguments[2];
        y2 = arguments[3];
    }else{
        return false;
    }
    return this._getDistance(x1,y1,x2,y2);
}
