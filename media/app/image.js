kerk.image = function(option){
    kerk.add(this);
    
    this.name   = option.name;
    this.option = option;
    this.sprite = new PIXI.Sprite.fromImage(option.src);

    this.sprite.anchor.x = option.anchorX;
    this.sprite.anchor.y = option.anchorY;
    
    this.sprite.alpha    = option.opacity;
    this.sprite.scale    = {x: option.scaleX,y: option.scaleY};
    this.sprite.rotation = option.rotation;
    
    kerk.objectBlend(this.sprite,option.blend);
    
    kerk.addObject(this.sprite,option.parentLayer || 'other');
    
    if(option.solid){
        this.box = new kerk.box({
            object: this.sprite,
            solid: true
        })
    }
    
    this.scripts = kerk.scriptsCreate(option.id,this);
    
    kerk.scriptsSetAction('startAction',this.scripts);
}
kerk.image.prototype = {
    update: function(){
        var layer   = kerk.layers[this.sprite.userData.layerUse],
            x       = this.option.x + layer.position.x,
            y       = this.option.y + layer.position.y,
            fx3D    = kerk.Fx3D(x,y,this.option.floor,this.option.factor);
            
            this.sprite.position.x = fx3D.x - layer.position.x;
            this.sprite.position.y = fx3D.y - layer.position.y;
            
            if(this.option.lens) this.sprite.visible = kerk.isVisible(x,y,0,0).visible;
            
            kerk.scriptsSetAction('updateAction',this.scripts)
    },
    destroy: function(){
        if(this.box) this.box.destroy();
        kerk.removeObject(this.sprite);
        kerk.scriptsSetAction('destroyAction',this.scripts)
        kerk.remove(this);
    }
}