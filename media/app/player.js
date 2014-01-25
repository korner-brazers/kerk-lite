kerk.player = function(option){
    kerk.add(this);
    
    this.name       = option.name;
    this.option     = option;
    this.unitid     = option.unitid;
    this.object     = kerk.createNullObject();
    this.position   = new Vector({x:0,y:0});
    this.gameObject = LoadObj.objects[option.object_id];
    this.life       = this.gameObject.health;
    this.sound      = {};
    this.controller = kerk.getController(option.unitid);
    
    
    if(this.gameObject){
        
        this.object.position.x = option.position.x;
        this.object.position.y = option.position.y;
        
        this.position.x = option.position.x;
        this.position.y = option.position.y;
        
        this.animation = new kerk.animation({
            object:    this.object,
            animation: this.gameObject.animation,
            unitid:    this.unitid
        })
        
        this.jumpTween = new TweenFn(this.gameObject.jump);
        this.jump      = false;
        
        this.sound.move = new kerk.sound({
            src: this.gameObject.soundMove,
            id: this.unitid,
            radius: this.gameObject.soundDistance,
            loop: 1,
            timerToStop: 300,
            position: this.object.position
        })
        
        this.sound.jump = new kerk.sound({
            src: this.gameObject.soundJump,
            id: this.unitid,
            radius: this.gameObject.soundDistance,
            position: this.object.position
        })
        
        this.sound.landing = new kerk.sound({
            src: this.gameObject.soundLanding,
            id: this.unitid,
            radius: this.gameObject.soundDistance,
            position: this.object.position
        })
    }
    else console.warn('No find object in data');
    
    this.scripts = kerk.scriptsCreate(option.object_id,this);
    
    kerk.scriptsSetAction('startAction',this.scripts);
}
kerk.player.prototype = {
    destroy: function(){
        if(this.animation) this.animation.destroy();
        kerk.scriptsSetAction('destroyAction',this.scripts)
        kerk.remove(this);
    },
    setPosition: function(position){
        this.position.set(position);
    },
    update: function(){
        kerk.scriptsSetAction('updateAction',this.scripts)
    }
}