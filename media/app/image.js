kerk.image = function(option){
    kerk.add(this);
    
    this.name       = option.name;
    this.gameObject = option;
    this.sprite     = new PIXI.Sprite.fromImage(option.src);

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
        
        this.body = new kerk.box2D({
            type: 'box',
            width: this.sprite.width,
            height: this.sprite.height,
            position: {
                x: this.gameObject.x,
                y: this.gameObject.y
            },
            dynamic: this.gameObject.dynamic,
            userData: 'image'
        })
        
    }
    
    this.scripts = kerk.scriptsCreate(option.id,this);
    
    kerk.scriptsSetAction('startAction',this.scripts);
}
kerk.image.prototype = {
    update: function(){
        var layer = kerk.layers[this.sprite.userData.layerUse];
        
        if(this.body){
            this.position    = this.body.GetPosition();
            this.position.x += layer.position.x;
            this.position.y += layer.position.y;
        }
        else{
            this.position = {
                x: this.gameObject.x + layer.position.x,
                y: this.gameObject.y + layer.position.y
            }
        }
        
        var fx3D = kerk.Fx3D(this.position.x,this.position.y,this.gameObject.floor,this.gameObject.factor);
        
        this.sprite.position.x = fx3D.x - layer.position.x;
        this.sprite.position.y = fx3D.y - layer.position.y;
        
        if(this.body) this.sprite.rotation = this.body.GetAngle();
        
        if(this.gameObject.lens) this.sprite.visible = kerk.isVisible(this.position.x,this.position.y,0,0).visible;
        
        kerk.scriptsSetAction('updateAction',this.scripts)
    },
    destroy: function(){
        if(this.box) this.box.destroy();
        kerk.removeObject(this.sprite);
        kerk.scriptsSetAction('destroyAction',this.scripts)
        kerk.remove(this);
    }
}