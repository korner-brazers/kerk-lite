kerk.mapBox = function(option){
    kerk.add(this);
    
    this.name      = option.name;
    this.option    = option;
    this.boxOption = {
        position: {
            x: option.x,
            y: option.y
        },
        width: option.w,
        height: option.h,
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
    
    this.scripts = kerk.scriptsCreate(option.id,this);
    
    kerk.scriptsSetAction('startAction',this.scripts);
}
kerk.mapBox.prototype = {
    update: function(){
        kerk.scriptsSetAction('updateAction',this.scripts)
    },
    destroy: function(){
        if(this.box) this.box.destroy();
        kerk.scriptsSetAction('destroyAction',this.scripts)
        kerk.remove(this);
    }
}