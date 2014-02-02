kerk.animationObject = function(option){
    kerk.add(this);
    
    this.animation = new kerk.animation({
        object:    option.object,
        animation: option.animationObject,
        unitid:    option.unitid
    })
    
    for(var i in option.scins) this.animation.scin(option.scins[i],1);
    
    this.animation.setAnimate(option.animation);
    
    var scope = this;
    
    this.animation.callTimeEnd = function(){
        scope.destroy();
    }
}
kerk.animationObject.prototype = {
    update: function(){
        
    },
    destroy: function(){
        this.animation.destroy();
        
        kerk.remove(this);
    }
}