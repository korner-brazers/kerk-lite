kerk.sprite = function(id,option){
    kerk.add(this);
    
    this.active = true;
    this.exists = false;
    
    this.currentDisplayTime = this.currentTile = 0;
    
    this.frames = [];
    
    if(LoadObj.sprite[id]){
        this.sprite = LoadObj.sprite[id];
        
        var explosionTextures = [];
		
		for (var i=0; i < this.sprite.frames.length; i++) explosionTextures.push(PIXI.Texture.fromFrame(this.sprite.frames[i]));
		
		
		this.object = new PIXI.MovieClip(explosionTextures);
		
		this.object.anchor.x = option && option.anchorX ? option.anchorX : 0.5;
		this.object.anchor.y = option && option.anchorY ? option.anchorY : 0.5;
		
		if(this.sprite.loop) this.object.play();
		else this.object.gotoAndStop(0);
        
        this.exists = true;
    }
    else{
        this.object = kerk.createNullObject();
        
        console.log('No find sprite in data');
    }
}
kerk.sprite.prototype = {
    setVisible: function(a){
        this.active = a;
        this.object.visible = a;
    },
    update: function(){
        if(this.exists) this.object.animationSpeed = this.sprite.frameRate*delta;
    },
    destroy: function(){
        kerk.remove(this);
    }
}