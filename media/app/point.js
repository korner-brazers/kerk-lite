kerk.point = function(option){
    kerk.add(this);
    
    this.name       = option.name;
    this.gameObject = option;
    this.position   = {
        x: option.x,
        y: option.y
    }
    
    this.scripts = kerk.scriptsCreate(option.id,this);
    
    kerk.scriptsSetAction('startAction',this.scripts);
}
kerk.point.prototype = {
    update: function(){
        kerk.scriptsSetAction('updateAction',this.scripts)
    },
    destroy: function(){
        kerk.scriptsSetAction('destroyAction',this.scripts)
        kerk.remove(this);
    }
}