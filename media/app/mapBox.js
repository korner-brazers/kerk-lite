kerk.mapBox = function(option){
    kerk.add(this);
    
    this.name       = option.name;
    this.option     = option;
    this.gameObject = option;
    this.width      = option.w * option.scaleX;
    this.height     = option.h * option.scaleY;
    this.boxOption  = {
        position: {
            x: option.x,
            y: option.y
        },
        width: this.width,
        height: this.height,
        rotation: option.rotation,
        tag: option.tag,
        anchor: {
            x: option.anchorX,
            y: option.anchorY
        },
        scale: {
            x: option.scaleX,
            y: option.scaleY
        }
    }
    
    this.box = new kerk.box({
        object: this.boxOption,
        solid: option.solid
    })
        
    if(option.solid){
        this.body = new kerk.box2D({
            type: 'box',
            width:  this.width,
            height: this.height,
            position: {
                x: option.x,
                y: option.y
            }
        })
        
        this.body.SetAngle(option.rotation)
    }
    
    this.scripts = kerk.scriptsCreate(option.id,this);
    
    kerk.scriptsSetAction('startAction',this.scripts);
}
kerk.mapBox.prototype = {
    update: function(){
        kerk.scriptsSetAction('updateAction',this.scripts)
    },
    destroy: function(){
        this.box.destroy();
        if(this.body) this.body.destroy();
        
        kerk.scriptsSetAction('destroyAction',this.scripts)
        kerk.remove(this);
    }
}