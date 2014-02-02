kerk.emiter = function(option){
    kerk.add(this);
    
    this.name       = option.name;
    this.gameObject = option;
    this.position   = {x:option.x,y:option.y};
    this.fxOption   = {
        id: option.fx,
        unitid: unitid,
        layer: option.parentLayer,
        position: this.position,
        xVariance: option.w,
        yVariance: option.h,
        angle: option.rotation,
        atachToCam: option.atachToCam
    };
    
    if(option.active) this.create();
    
    this.scripts = kerk.scriptsCreate(option.id,this);
    
    kerk.scriptsSetAction('startAction',this.scripts);
}
kerk.emiter.prototype = {
    create: function(){
        this.createdFx = new kerk.fx(this.fxOption);
    },
    update: function(){
        kerk.scriptsSetAction('updateAction',this.scripts)
    },
    destroy: function(){
        if(this.createdFx) this.createdFx.setDie();
        kerk.scriptsSetAction('destroyAction',this.scripts)
        kerk.remove(this);
    }
}