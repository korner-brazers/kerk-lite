kerk.tracer = function(option){
    kerk.add(this);
    
    this.gameObject   = LoadObj.tracers[option.id];
    this.position     = option.position || {x:0,y:0};
    this.lastPosition = false;
    this.tracers      = [];
    this.unitid       = option.unitid;
    this.dead         = false;
    
    if(this.gameObject){
        if(this.gameObject.useFx){
            this.useFx = new kerk.fx({
                id: this.gameObject.useFx,
                unitid: this.unitid,
                position: this.position,
                angle: 0
            })
            
            this.exists = false;
        }
        else this.exists = true;
    }
    
    this.scripts = kerk.scriptsCreate(option.id,this);
    
    kerk.scriptsSetAction('startAction',this.scripts);
}
kerk.tracer.prototype = {
    setPoint: function(position){
        this.position = position;
    },
    setDead: function(){
        this.dead = true;
    },
    update: function(){
        if(!this.lastPosition){
            this.lastPosition = {
                x: this.position.x,
                y: this.position.y
            }
        }
        
        if(this.exists && this.lastPosition){
            var distance = ToPointObject(this.lastPosition,this.position);
            
            if(distance >= this.gameObject.density){
                
                var tracer = new PIXI.Sprite.fromImage(this.gameObject.image);
                    tracer.position.x = this.gameObject.stretch ? this.lastPosition.x : this.position.x;
                    tracer.position.y = this.gameObject.stretch ? this.lastPosition.y : this.position.y;
                    tracer.anchor.x   = this.gameObject.stretch ? 0 : 0.5;
                    tracer.anchor.y   = 0.5;
                    
                    tracer.userData = {};
                    
                    tracer.userData.tween_scale    = new TweenFn(this.gameObject.scale);
                    tracer.userData.tween_opacity  = new TweenFn(this.gameObject.opacity);
                    tracer.userData.tween_rotation = new TweenFn(this.gameObject.rotation);
                    
                    tracer.userData.tween_scale.setTimeDiff(this.gameObject.timelive);
                    tracer.userData.tween_opacity.setTimeDiff(this.gameObject.timelive);
                    tracer.userData.tween_rotation.setTimeDiff(this.gameObject.timelive);
                    
                    tracer.userData.age = 0;
                    tracer.userData.stretch = this.gameObject.stretch;
                    
                    var scale = tracer.userData.tween_scale.lerp(0);
                    
                    tracer.scale.x  = this.gameObject.stretch ? distance / tracer.width : scale;
                    tracer.scale.y  = this.gameObject.stretch ? 1 : scale;
                    tracer.alpha    = tracer.userData.tween_opacity.lerp(0);
                    tracer.rotation = this.gameObject.stretch ? ToAngleObject(this.lastPosition,this.position) : ToAngleObject(this.position,this.lastPosition);
                    
                    kerk.objectBlend(tracer,this.gameObject.blend);
                    
                this.tracers.push(tracer);
                
                kerk.addObject(tracer,'players');

                this.lastPosition.x = this.position.x;
                this.lastPosition.y = this.position.y;
            }
            
            for(var i in this.tracers){
                var trac = this.tracers[i];
                    trac.alpha = trac.userData.tween_opacity.addDelta(focusDelta);
                    
                    if(!trac.userData.stretch){
                        var scale = trac.userData.tween_scale.addDelta(focusDelta);
                        
                        trac.scale.x = scale;
                        trac.scale.y = scale;
                        
                        /* Пока подумаем */
                        //trac.rotation = trac.userData.tween_rotation.addDelta(delta);
                    }
                    
                    trac.userData.age += focusDelta*1000;
                    
                    if(trac.userData.age >= this.gameObject.timelive){
                        kerk.removeObject(trac);
                        removeArray(this.tracers,trac);
                    } 
            }
        }
        
        kerk.scriptsSetAction('updateAction',this.scripts)
        
        if(this.dead && this.tracers.length == 0) this.destroy();
    },
    destroy: function(){
        for(var i in this.tracers) kerk.removeObject(this.tracers[i]);
        
        if(this.useFx) this.useFx.setDie();
        
        kerk.scriptsSetAction('destroyAction',this.scripts)
        
        kerk.remove(this);
    }
}